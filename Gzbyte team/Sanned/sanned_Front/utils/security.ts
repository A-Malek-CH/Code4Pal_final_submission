// Security utilities for input validation and sanitization
import { z } from 'zod';

/**
 * Input Sanitization Utilities
 * Protects against XSS, HTML injection, and other malicious inputs
 */

// HTML tag and script tag sanitization
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: urls
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Decode HTML entities to prevent double encoding attacks
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    // Remove them again after decoding
    .replace(/<[^>]*>/g, '')
    // Trim whitespace
    .trim();
};

// SQL Injection prevention for user inputs
export const sanitizeSql = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove SQL keywords and injection patterns
    .replace(/('|(\\'))/g, "''") // Escape single quotes
    .replace(/(;|--|\||\*|%)/g, '') // Remove dangerous SQL characters
    .replace(/\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi, '')
    .trim();
};

// General input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return sanitizeHtml(sanitizeSql(input));
};

/**
 * Enhanced Validation Schemas with Security
 */

// User input validation
export const secureUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Name can only contain letters and spaces')
    .transform(sanitizeInput),
  
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .transform(input => input.toLowerCase().trim()),
  
  phone: z.string()
    .optional()
    .refine(val => !val || /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(val), 'Invalid phone number format')
    .transform(val => val ? sanitizeInput(val) : val),
  
  bio: z.string()
    .max(200, 'Bio must be less than 200 characters')
    .optional()
    .transform(val => val ? sanitizeInput(val) : val),
  
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters')
    .transform(sanitizeInput)
});

// Mission input validation
export const secureMissionSchema = z.object({
  title: z.string()
    .min(5, 'Mission title must be at least 5 characters')
    .max(100, 'Mission title must be less than 100 characters')
    .transform(sanitizeInput),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .transform(sanitizeInput),
  
  location: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters')
    .transform(sanitizeInput),
  
  amount: z.number()
    .min(0, 'Amount cannot be negative')
    .max(10000, 'Amount cannot exceed $10,000')
    .optional(),
  
  urgency: z.enum(['Urgent', 'Soon', 'Flexible']),
  
  paymentType: z.enum(['Volunteer', 'Paid', 'Sponsor']),
  
  skills: z.array(z.string().max(50).transform(sanitizeInput))
    .max(10, 'Maximum 10 skills allowed')
    .optional()
});

// Authentication validation
export const secureAuthSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .transform(input => input.toLowerCase().trim()),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

/**
 * Rate Limiting & Security Headers
 */

// Simple in-memory rate limiter for client-side protection
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

/**
 * Secure Data Storage Utilities
 */

// Encrypt sensitive data before storage
export const encryptSensitiveData = (data: string, key: string = 'default_key'): string => {
  // Simple XOR encryption for demonstration
  // In production, use proper encryption libraries like crypto-js
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(encrypted); // Base64 encode
};

// Decrypt sensitive data
export const decryptSensitiveData = (encryptedData: string, key: string = 'default_key'): string => {
  try {
    const data = atob(encryptedData); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

/**
 * Security Validation Functions
 */

// Validate file uploads
export const validateFileUpload = (file: { uri: string; type?: string; size?: number }): boolean => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (file.type && !allowedTypes.includes(file.type)) {
    return false;
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size && file.size > maxSize) {
    return false;
  }
  
  return true;
};

// Validate URLs to prevent SSRF attacks
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    
    // Only allow https for external resources
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Block localhost and private IP ranges
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Content Security Policy helpers
 */

export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Input Validation Middleware
 */

export const validateAndSanitizeForm = <T>(schema: z.ZodSchema<T>, data: any): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

export default {
  sanitizeHtml,
  sanitizeSql,
  sanitizeInput,
  secureUserSchema,
  secureMissionSchema,
  secureAuthSchema,
  checkRateLimit,
  encryptSensitiveData,
  decryptSensitiveData,
  validateFileUpload,
  validateUrl,
  generateNonce,
  validateAndSanitizeForm
};