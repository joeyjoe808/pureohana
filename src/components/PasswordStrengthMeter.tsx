import React, { useState, useEffect } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import { evaluatePasswordStrength, strengthColors, generateSecurePassword, PasswordStrength } from '../utils/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
  showGenerateOption?: boolean;
  onGeneratePassword?: (password: string) => void;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showGenerateOption = false,
  onGeneratePassword,
}) => {
  const [strength, setStrength] = useState({
    strength: PasswordStrength.VeryWeak,
    score: 0,
    feedback: ['Enter a password to see strength feedback.']
  });

  useEffect(() => {
    if (password) {
      setStrength(evaluatePasswordStrength(password));
    } else {
      setStrength({
        strength: PasswordStrength.VeryWeak,
        score: 0,
        feedback: ['Enter a password to see strength feedback.']
      });
    }
  }, [password]);

  const handleGeneratePassword = () => {
    if (onGeneratePassword) {
      const newPassword = generateSecurePassword();
      onGeneratePassword(newPassword);
    }
  };

  return (
    <div className="mt-2 mb-4">
      <div className="flex items-center mb-2">
        <div className="flex-grow flex h-2 bg-slate-700 rounded overflow-hidden">
          {[1, 2, 3, 4].map((segment) => (
            <div 
              key={segment} 
              className={`h-full flex-1 ${strength.score >= segment * 20 ? strengthColors[strength.strength] : 'bg-slate-700'}`}
            ></div>
          ))}
        </div>
        {showGenerateOption && (
          <button
            type="button"
            onClick={handleGeneratePassword}
            className="ml-3 text-xs text-yellow-400 hover:text-yellow-300 flex items-center"
          >
            <RefreshCw size={12} className="mr-1" />
            Generate
          </button>
        )}
      </div>
      
      <div className="text-xs">
        <div className="flex items-center text-gray-400">
          <span className="font-medium mr-2">Strength:</span> 
          <span className={`
            ${strength.strength === PasswordStrength.VeryWeak || strength.strength === PasswordStrength.Weak 
              ? 'text-red-400' 
              : strength.strength === PasswordStrength.Moderate 
                ? 'text-yellow-400' 
                : 'text-green-400'
            }`}>
            {strength.strength}
          </span>
        </div>
        
        <ul className="mt-2 space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-start">
              {feedback.startsWith('Add') || feedback.startsWith('Avoid') || feedback.startsWith('Password should') ? (
                <X size={12} className="text-red-400 mr-1.5 mt-0.5 flex-shrink-0" />
              ) : (
                <Check size={12} className="text-green-400 mr-1.5 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-gray-400">{feedback}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;