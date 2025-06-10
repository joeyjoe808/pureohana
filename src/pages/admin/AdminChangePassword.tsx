import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Save, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';
import { validatePassword } from '../../utils/securityUtils';

const AdminChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGeneratePassword = (password: string) => {
    setNewPassword(password);
    setConfirmPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation checks
    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    
    // Password strength validation
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) {
      setError(passwordCheck.message);
      return;
    }
    
    setLoading(true);
    
    try {
      // First verify the current password is correct
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect.');
      }
      
      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccess('Password updated successfully.');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
      console.error('Password update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-medium text-white mb-6">Change Password</h2>
      
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start">
          <AlertTriangle size={18} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-md p-4 flex items-start">
          <CheckCircle size={18} className="text-green-400 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-300">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6">
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-gray-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter your current password"
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* New Password */}
          <div>
            <label className="block text-gray-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                placeholder="Enter new password"
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <PasswordStrengthMeter 
              password={newPassword} 
              showGenerateOption={true}
              onGeneratePassword={handleGeneratePassword}
            />
          </div>
          
          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              placeholder="Confirm new password"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
            )}
          </div>
          
          {/* Password Requirements */}
          <div className="bg-slate-700/50 p-4 rounded-md text-sm">
            <h3 className="text-white font-medium mb-2">Password Requirements:</h3>
            <ul className="space-y-1 text-gray-300">
              <li className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-slate-600'}`}>
                  {newPassword.length >= 8 && <Check size={10} className="text-white" />}
                </div>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-slate-600'}`}>
                  {/[A-Z]/.test(newPassword) && <Check size={10} className="text-white" />}
                </div>
                Contains uppercase letters
              </li>
              <li className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-slate-600'}`}>
                  {/\d/.test(newPassword) && <Check size={10} className="text-white" />}
                </div>
                Contains numbers
              </li>
              <li className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'bg-green-500' : 'bg-slate-600'}`}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) && <Check size={10} className="text-white" />}
                </div>
                Contains special characters
              </li>
            </ul>
          </div>
          
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || newPassword !== confirmPassword}
            className="w-full px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>For security reasons, you'll be required to sign in again after changing your password.</p>
      </div>
    </div>
  );
};

export default AdminChangePassword;