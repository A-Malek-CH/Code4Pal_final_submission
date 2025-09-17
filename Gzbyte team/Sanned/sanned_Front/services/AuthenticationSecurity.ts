// Enhanced Authentication and Security Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  sessionTimeout: number; // in minutes
  passwordMinLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  sessionTimeout: 60,
  passwordMinLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

export class AuthenticationSecurity {
  private static config: SecurityConfig = DEFAULT_SECURITY_CONFIG;
  private static SESSION_KEY = 'sanned_session';
  private static LOGIN_ATTEMPTS_KEY = 'sanned_login_attempts';
  private static LOCKOUT_KEY = 'sanned_lockout';

  // Password strength validation
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < this.config.passwordMinLength) {
      errors.push(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }
    
    if (this.config.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (this.config.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (this.config.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (this.config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }
    
    if (/123456|password|qwerty|abc123|admin/i.test(password)) {
      errors.push('Password cannot contain common patterns');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate secure session token
  static generateSessionToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result + '_' + Date.now();
  }

  // Store secure session
  static async storeSecureSession(userId: string, token: string): Promise<void> {
    try {
      const sessionData = {
        userId,
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + (this.config.sessionTimeout * 60 * 1000),
        deviceId: await this.getDeviceIdentifier(),
      };
      
      await AsyncStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to store secure session:', error);
      throw new Error('Session storage failed');
    }
  }

  // Validate session
  static async validateSession(): Promise<{ valid: boolean; userId?: string; token?: string }> {
    try {
      const sessionString = await AsyncStorage.getItem(this.SESSION_KEY);
      if (!sessionString) {
        return { valid: false };
      }
      
      const session = JSON.parse(sessionString);
      const now = Date.now();
      
      // Check if session has expired
      if (now > session.expiresAt) {
        await this.clearSession();
        return { valid: false };
      }
      
      // Validate device consistency (prevent session hijacking)
      const currentDeviceId = await this.getDeviceIdentifier();
      if (session.deviceId !== currentDeviceId) {
        await this.clearSession();
        return { valid: false };
      }
      
      return {
        valid: true,
        userId: session.userId,
        token: session.token
      };
    } catch (error) {
      console.error('Session validation failed:', error);
      return { valid: false };
    }
  }

  // Clear session
  static async clearSession(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.SESSION_KEY]);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  // Track login attempts
  static async trackLoginAttempt(email: string, success: boolean): Promise<{ canAttempt: boolean; attemptsLeft?: number; lockoutMinutes?: number }> {
    try {
      const key = `${this.LOGIN_ATTEMPTS_KEY}_${email}`;
      const lockoutKey = `${this.LOCKOUT_KEY}_${email}`;
      
      // Check if user is currently locked out
      const lockoutString = await AsyncStorage.getItem(lockoutKey);
      if (lockoutString) {
        const lockoutData = JSON.parse(lockoutString);
        if (Date.now() < lockoutData.expiresAt) {
          const remainingMinutes = Math.ceil((lockoutData.expiresAt - Date.now()) / (60 * 1000));
          return {
            canAttempt: false,
            lockoutMinutes: remainingMinutes
          };
        } else {
          // Lockout expired, clear it
          await AsyncStorage.removeItem(lockoutKey);
        }
      }
      
      if (success) {
        // Clear attempts on successful login
        await AsyncStorage.removeItem(key);
        return { canAttempt: true };
      }
      
      // Track failed attempt
      const attemptsString = await AsyncStorage.getItem(key);
      let attempts = attemptsString ? JSON.parse(attemptsString) : { count: 0, firstAttempt: Date.now() };
      
      attempts.count += 1;
      attempts.lastAttempt = Date.now();
      
      if (attempts.count >= this.config.maxLoginAttempts) {
        // Lock out user
        const lockoutData = {
          expiresAt: Date.now() + (this.config.lockoutDuration * 60 * 1000),
          attempts: attempts.count
        };
        
        await AsyncStorage.setItem(lockoutKey, JSON.stringify(lockoutData));
        await AsyncStorage.removeItem(key);
        
        return {
          canAttempt: false,
          lockoutMinutes: this.config.lockoutDuration
        };
      }
      
      await AsyncStorage.setItem(key, JSON.stringify(attempts));
      
      return {
        canAttempt: true,
        attemptsLeft: this.config.maxLoginAttempts - attempts.count
      };
    } catch (error) {
      console.error('Failed to track login attempt:', error);
      return { canAttempt: true };
    }
  }

  // Get device identifier for session validation
  private static async getDeviceIdentifier(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem('sanned_device_id');
      if (!deviceId) {
        // Generate unique device ID
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        await AsyncStorage.setItem('sanned_device_id', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('Failed to get device identifier:', error);
      return 'unknown_device';
    }
  }

  // Secure password hashing (simulation - in production use bcrypt or similar)
  static async hashPassword(password: string): Promise<string> {
    // This is a simple simulation - use proper password hashing in production
    const salt = Math.random().toString(36).substring(2, 15);
    const hash = password.split('').reduce((acc, char, index) => {
      return acc + char.charCodeAt(0) + index + salt.charCodeAt(index % salt.length);
    }, 0);
    return `${salt}:${hash}`;
  }

  // Verify password against hash
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const [salt, originalHash] = hashedPassword.split(':');
      const hash = password.split('').reduce((acc, char, index) => {
        return acc + char.charCodeAt(0) + index + salt.charCodeAt(index % salt.length);
      }, 0);
      return hash.toString() === originalHash;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  }

  // Security headers and policies
  static getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';",
    };
  }

  // Audit logging for security events
  static async logSecurityEvent(event: string, details: any): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details,
        deviceId: await this.getDeviceIdentifier(),
      };
      
      // In production, send to secure logging service
      console.log('Security Event:', logEntry);
      
      // Store locally for debugging (limit storage)
      const logsKey = 'sanned_security_logs';
      const existingLogs = await AsyncStorage.getItem(logsKey);
      let logs = existingLogs ? JSON.parse(existingLogs) : [];
      
      logs.push(logEntry);
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs = logs.slice(-100);
      }
      
      await AsyncStorage.setItem(logsKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Check for suspicious activity
  static async detectSuspiciousActivity(userId: string): Promise<{ suspicious: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    
    try {
      // Check for multiple recent failed login attempts
      const attemptsKey = `${this.LOGIN_ATTEMPTS_KEY}_${userId}`;
      const attemptsString = await AsyncStorage.getItem(attemptsKey);
      if (attemptsString) {
        const attempts = JSON.parse(attemptsString);
        if (attempts.count > 3) {
          reasons.push('Multiple failed login attempts');
        }
      }
      
      // Check session consistency
      const session = await this.validateSession();
      if (!session.valid) {
        reasons.push('Invalid session state');
      }
      
      return {
        suspicious: reasons.length > 0,
        reasons
      };
    } catch (error) {
      console.error('Suspicious activity detection failed:', error);
      return { suspicious: false, reasons: [] };
    }
  }

  // Force password change
  static async requirePasswordChange(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`sanned_password_change_${userId}`, 'required');
      await this.logSecurityEvent('password_change_required', { userId });
    } catch (error) {
      console.error('Failed to require password change:', error);
    }
  }

  // Check if password change is required
  static async isPasswordChangeRequired(userId: string): Promise<boolean> {
    try {
      const required = await AsyncStorage.getItem(`sanned_password_change_${userId}`);
      return required === 'required';
    } catch (error) {
      console.error('Failed to check password change requirement:', error);
      return false;
    }
  }

  // Security configuration
  static updateSecurityConfig(config: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Get security status
  static async getSecurityStatus(): Promise<{
    sessionValid: boolean;
    lastSecurityCheck: Date;
    securityLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
  }> {
    const session = await this.validateSession();
    const recommendations: string[] = [];
    
    let securityLevel: 'low' | 'medium' | 'high' = 'medium';
    
    if (!session.valid) {
      recommendations.push('Please log in to secure your session');
      securityLevel = 'low';
    }
    
    if (this.config.passwordMinLength < 8) {
      recommendations.push('Consider using longer passwords');
    }
    
    if (!this.config.requireUppercase || !this.config.requireNumbers) {
      recommendations.push('Enable stronger password requirements');
    } else {
      securityLevel = 'high';
    }
    
    return {
      sessionValid: session.valid,
      lastSecurityCheck: new Date(),
      securityLevel,
      recommendations
    };
  }
}

export default AuthenticationSecurity;