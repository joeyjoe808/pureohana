import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface NewsletterFormProps {
  location?: string;
  buttonText?: string;
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  location = 'website', 
  buttonText = 'Subscribe',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim the email to remove any whitespace
    const trimmedEmail = email.trim();
    
    // Simple email validation
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Direct database insertion approach
      try {
        // Check if email already exists
        const { data: existingSubscriber, error: lookupError } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .eq('email', trimmedEmail)
          .maybeSingle();
        
        if (lookupError) {
          console.error("Error checking existing subscriber:", lookupError);
          throw lookupError;
        }
        
        if (existingSubscriber) {
          // If subscriber exists but is inactive, reactivate them
          if (!existingSubscriber.active) {
            await reactivateSubscription(trimmedEmail);
          } else {
            setMessage({ type: 'info', text: 'You\'re already subscribed to our newsletter.' });
          }
          return;
        }
        
        // Insert new subscriber
        const { error: insertError } = await supabase
          .from('newsletter_subscribers')
          .insert([{ 
            email: trimmedEmail, 
            source: location, 
            active: true,
            subscribed_at: new Date().toISOString()
          }]);
        
        if (insertError) {
          console.error("Error inserting subscriber:", insertError);
          throw insertError;
        }
        
        setMessage({ type: 'success', text: 'Thank you for subscribing to our newsletter!' });
        setEmail('');
      } catch (error) {
        console.error("Newsletter subscription direct database error:", error);
        throw error;
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ 
        type: 'error', 
        text: 'There was an error subscribing. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const reactivateSubscription = async (email: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          active: true, 
          unsubscribed_at: null,
          subscribed_at: new Date().toISOString()
        })
        .eq('email', email);
      
      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: 'Welcome back! Your subscription has been reactivated.' 
      });
      setEmail('');
    } catch (error) {
      throw error;
    }
  };
  
  return (
    <div className={className}>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="relative">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email" 
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 text-white text-sm"
            aria-label="Email address"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit"
          className="w-full px-4 py-2 bg-yellow-400 text-slate-900 font-light rounded-sm hover:bg-yellow-500 transition-colors text-sm flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : buttonText}
        </button>
      </form>
      
      {message.text && (
        <div className={`mt-3 text-sm ${
          message.type === 'success' ? 'text-green-400' : 
          message.type === 'error' ? 'text-red-400' : 
          message.type === 'info' ? 'text-blue-400' : ''
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;