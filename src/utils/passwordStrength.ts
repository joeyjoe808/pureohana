/**
 * Password strength calculator for Pure Ohana Treasures
 * 
 * This utility helps users create strong, secure passwords by
 * providing feedback on password strength.
 */

// Password strength levels
export enum PasswordStrength {
  VeryWeak = 'Very Weak',
  Weak = 'Weak',
  Moderate = 'Moderate',
  Strong = 'Strong',
  VeryStrong = 'Very Strong'
}

// Password strength color indicators
export const strengthColors = {
  [PasswordStrength.VeryWeak]: 'bg-red-500',
  [PasswordStrength.Weak]: 'bg-orange-500',
  [PasswordStrength.Moderate]: 'bg-yellow-500',
  [PasswordStrength.Strong]: 'bg-green-400',
  [PasswordStrength.VeryStrong]: 'bg-green-600'
};

// Evaluate password strength
export const evaluatePasswordStrength = (password: string): {
  strength: PasswordStrength;
  score: number;
  feedback: string[];
} => {
  // Default response
  const result = {
    strength: PasswordStrength.VeryWeak,
    score: 0,
    feedback: []
  };
  
  // Empty password
  if (!password) {
    result.feedback.push('Please enter a password.');
    return result;
  }
  
  // Calculate base score and gather feedback
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long.');
  } else {
    score += password.length > 12 ? 25 : 15;
  }
  
  // Complexity checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUppercase) {
    feedback.push('Add uppercase letters for stronger security.');
  } else {
    score += 10;
  }
  
  if (!hasLowercase) {
    feedback.push('Add lowercase letters for better security.');
  } else {
    score += 10;
  }
  
  if (!hasNumbers) {
    feedback.push('Add numbers to strengthen your password.');
  } else {
    score += 10;
  }
  
  if (!hasSpecialChars) {
    feedback.push('Add special characters (!@#$%^&*) for maximum security.');
  } else {
    score += 15;
  }
  
  // Check for common patterns
  const commonPatterns = [
    '123456', '123123', '111111', '000000', 'qwerty', 'password', 'admin'
  ];
  
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    feedback.push('Avoid common patterns like "123456" or "password".');
    score -= 20;
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeating the same character more than twice.');
    score -= 10;
  }
  
  // Ensure minimum score of 0
  score = Math.max(0, score);
  
  // Categorize strength based on score
  if (score >= 60) {
    result.strength = PasswordStrength.VeryStrong;
    if (feedback.length === 0) {
      feedback.push('Excellent password choice!');
    }
  } else if (score >= 45) {
    result.strength = PasswordStrength.Strong;
  } else if (score >= 30) {
    result.strength = PasswordStrength.Moderate;
  } else if (score >= 15) {
    result.strength = PasswordStrength.Weak;
  } else {
    result.strength = PasswordStrength.VeryWeak;
  }
  
  // Add positive feedback for strong passwords
  if (score >= 45 && feedback.length === 0) {
    feedback.push('Good job! Your password meets security recommendations.');
  }
  
  result.score = score;
  result.feedback = feedback;
  
  return result;
};

// Generate a secure password
export const generateSecurePassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Ensure it has at least one of each required type
  if (!/[A-Z]/.test(password)) password = replaceRandomChar(password, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (!/[a-z]/.test(password)) password = replaceRandomChar(password, 'abcdefghijklmnopqrstuvwxyz');
  if (!/\d/.test(password)) password = replaceRandomChar(password, '0123456789');
  if (!/[!@#$%^&*()]/.test(password)) password = replaceRandomChar(password, '!@#$%^&*()');
  
  return password;
};

// Helper function to replace a random character in the password
const replaceRandomChar = (password: string, charset: string): string => {
  const randomPosToReplace = Math.floor(Math.random() * password.length);
  const randomCharToAdd = charset[Math.floor(Math.random() * charset.length)];
  
  return (
    password.substring(0, randomPosToReplace) +
    randomCharToAdd +
    password.substring(randomPosToReplace + 1)
  );
};