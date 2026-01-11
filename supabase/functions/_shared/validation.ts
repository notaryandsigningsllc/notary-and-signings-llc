// Shared validation utilities for edge functions
// Using a lightweight validation approach since Zod package has compatibility issues with Deno

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  errors: ValidationError[];
  
  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.errors = errors;
  }
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Phone validation - accepts various formats
export const isValidPhone = (phone: string): boolean => {
  // Remove common separators
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Check if it's 10-15 digits
  return /^\+?[0-9]{10,15}$/.test(cleaned);
};

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Date validation (YYYY-MM-DD)
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed.getTime());
};

// Time validation (HH:MM or HH:MM:SS)
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(time);
};

// String sanitization - remove potentially dangerous characters
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  return input
    .trim()
    .slice(0, maxLength)
    // Remove null bytes and control characters except newlines/tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

// Name validation
export const isValidName = (name: string): boolean => {
  const sanitized = sanitizeString(name, 100);
  return sanitized.length >= 2 && sanitized.length <= 100;
};

// Generic string length validation
export const isValidLength = (str: string, min: number, max: number): boolean => {
  const length = str.trim().length;
  return length >= min && length <= max;
};

// Payment method validation
export const isValidPaymentMethod = (method: string): boolean => {
  return ['online', 'at_appointment'].includes(method);
};

// Email type validation for follow-up emails
export const isValidEmailType = (type: string): boolean => {
  return ['review_request', 'service_upsell', 'newsletter_invite'].includes(type);
};

// Validate and sanitize booking data
export const validateBookingData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.serviceId || !isValidUUID(data.serviceId)) {
    errors.push({ field: 'serviceId', message: 'Invalid service ID' });
  }

  if (!data.appointmentDate || !isValidDate(data.appointmentDate)) {
    errors.push({ field: 'appointmentDate', message: 'Invalid appointment date (must be YYYY-MM-DD)' });
  }

  if (!data.appointmentTime || !isValidTime(data.appointmentTime)) {
    errors.push({ field: 'appointmentTime', message: 'Invalid appointment time (must be HH:MM)' });
  }

  if (!data.fullName || !isValidName(data.fullName)) {
    errors.push({ field: 'fullName', message: 'Name must be between 2 and 100 characters' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  if (!data.paymentMethod || !isValidPaymentMethod(data.paymentMethod)) {
    errors.push({ field: 'paymentMethod', message: 'Invalid payment method' });
  }

  if (data.notes && !isValidLength(data.notes, 0, 1000)) {
    errors.push({ field: 'notes', message: 'Notes must be less than 1000 characters' });
  }

  return errors;
};

// Validate contact form data
export const validateContactData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.name || !isValidName(data.name)) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  if (!data.message || !isValidLength(data.message, 10, 2000)) {
    errors.push({ field: 'message', message: 'Message must be between 10 and 2000 characters' });
  }

  return errors;
};

// Validate newsletter subscription data
export const validateNewsletterData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (data.name && !isValidLength(data.name, 0, 100)) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  return errors;
};

// Validate follow-up email data
export const validateFollowUpData = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.bookingId || !isValidUUID(data.bookingId)) {
    errors.push({ field: 'bookingId', message: 'Invalid booking ID' });
  }

  if (!data.emailType || !isValidEmailType(data.emailType)) {
    errors.push({ field: 'emailType', message: 'Invalid email type' });
  }

  if (!data.recipientEmail || !isValidEmail(data.recipientEmail)) {
    errors.push({ field: 'recipientEmail', message: 'Invalid recipient email' });
  }

  if (!data.recipientName || !isValidName(data.recipientName)) {
    errors.push({ field: 'recipientName', message: 'Recipient name must be between 2 and 100 characters' });
  }

  if (data.serviceName && !isValidLength(data.serviceName, 0, 200)) {
    errors.push({ field: 'serviceName', message: 'Service name must be less than 200 characters' });
  }

  return errors;
};

// ============================================================
// Rate Limiting Utilities
// ============================================================

// In-memory rate limit store (resets on function cold start)
// For production, consider using Redis or Supabase for persistent rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if a request should be rate limited
 * @param identifier - IP address or user ID to track
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns Object with isLimited boolean and remaining requests
 */
export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 3600000 // 1 hour default
): { isLimited: boolean; remaining: number; resetIn: number } => {
  const now = Date.now();
  const key = identifier;
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { isLimited: false, remaining: maxRequests - 1, resetIn: windowMs };
  }
  
  if (existing.count >= maxRequests) {
    return { 
      isLimited: true, 
      remaining: 0, 
      resetIn: existing.resetTime - now 
    };
  }
  
  existing.count++;
  rateLimitStore.set(key, existing);
  
  return { 
    isLimited: false, 
    remaining: maxRequests - existing.count, 
    resetIn: existing.resetTime - now 
  };
};

/**
 * Get client IP from request headers
 * Handles common proxy headers
 */
export const getClientIP = (req: Request): string => {
  // Check common proxy headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP (original client)
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // Fallback - unknown
  return 'unknown';
};

// ============================================================
// Stripe Webhook IP Validation
// ============================================================

// Stripe's documented webhook IP ranges
// Source: https://docs.stripe.com/ips
const STRIPE_WEBHOOK_IPS = [
  '3.18.12.63',
  '3.130.192.231',
  '13.235.14.237',
  '13.235.122.149',
  '18.211.135.69',
  '35.154.171.200',
  '52.15.183.38',
  '54.88.130.119',
  '54.88.130.237',
  '54.187.174.169',
  '54.187.205.235',
  '54.187.216.72',
];

// Stripe's IP CIDR ranges for webhooks
const STRIPE_WEBHOOK_CIDRS = [
  '3.18.12.63/32',
  '3.130.192.231/32',
  '13.235.14.237/32',
  '13.235.122.149/32',
  '18.211.135.69/32',
  '35.154.171.200/32',
  '52.15.183.38/32',
  '54.88.130.119/32',
  '54.88.130.237/32',
  '54.187.174.169/32',
  '54.187.205.235/32',
  '54.187.216.72/32',
];

/**
 * Check if IP is from Stripe's webhook servers
 * Note: In production, also verify webhook signature (already done in stripe-webhook)
 */
export const isStripeWebhookIP = (ip: string): boolean => {
  // Direct IP match
  if (STRIPE_WEBHOOK_IPS.includes(ip)) {
    return true;
  }
  
  // For development/testing, allow if signature verification passes
  // The signature verification is the primary security measure
  // IP allowlisting is defense-in-depth
  return false;
};

/**
 * Validate webhook source with logging for monitoring
 */
export const validateWebhookSource = (
  req: Request
): { ip: string; isStripeIP: boolean; hasSignature: boolean } => {
  const ip = getClientIP(req);
  const isStripeIP = isStripeWebhookIP(ip);
  const hasSignature = !!req.headers.get('stripe-signature');
  
  return { ip, isStripeIP, hasSignature };
};