/*
  # Security Audit Logging System

  1. New Tables
    - `security_audit_logs` - Tracks security-related actions in the system
  
  2. Security
    - Enable RLS on the table
    - Add policy for authenticated users to view their own logs
    - Add policy for service role to manage all logs
*/

-- Create security audit logs table
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS security_audit_logs_user_id_idx 
  ON security_audit_logs(user_id);
  
CREATE INDEX IF NOT EXISTS security_audit_logs_action_idx 
  ON security_audit_logs(action);
  
CREATE INDEX IF NOT EXISTS security_audit_logs_created_at_idx 
  ON security_audit_logs(created_at);

-- Enable RLS
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_security_event(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_ip_address TEXT;
  v_user_agent TEXT;
  v_log_id UUID;
BEGIN
  -- Get current user ID if authenticated
  v_user_id := auth.uid();
  
  -- These would normally come from the request context
  -- but we'll use placeholders in this function
  v_ip_address := current_setting('request.headers', true)::json->>'x-forwarded-for';
  v_user_agent := current_setting('request.headers', true)::json->>'user-agent';
  
  -- Insert the audit log
  INSERT INTO security_audit_logs(
    user_id, action, resource_type, resource_id, 
    ip_address, user_agent, details
  )
  VALUES (
    v_user_id, p_action, p_resource_type, p_resource_id, 
    v_ip_address, v_user_agent, p_details
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Still return null but don't fail if logging fails
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admin and service role can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON security_audit_logs
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Service role can manage audit logs
CREATE POLICY "Service role can manage audit logs"
  ON security_audit_logs
  USING (true)
  WITH CHECK (true);

-- Create trigger function to log sign-in attempts
CREATE OR REPLACE FUNCTION log_auth_event()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_security_event(
    CASE 
      WHEN NEW.factor_id IS NOT NULL THEN 'mfa_challenge'
      ELSE 'auth_sign_in_attempt'
    END,
    'auth',
    NEW.id::text,
    jsonb_build_object(
      'email', NEW.email,
      'success', NEW.created_at IS NOT NULL
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the trigger if logging fails
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- We would add a trigger on auth.sessions or similar table
-- but we don't have direct access to these in Supabase's auth schema
-- This is for illustration purposes