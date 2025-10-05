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

// Time validation (HH:MM)
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
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