export interface ContactFormValues {
  name: string;
  phone: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormValues, string>>;
}

export const WHATSAPP_NUMBER = '916369109409';

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hi Sir, I came across your real estate and construction business and viewed your property projects. I am interested in knowing more about them. Could we discuss the details?';

export function buildDefaultWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`;
}

export function validateContactFields(values: ContactFormValues): ValidationResult {
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};
  const name = (values.name || '').trim();
  const phone = (values.phone || '').trim();
  const message = (values.message || '').trim();

  if (!name || name.length < 2) {
    errors.name = 'Please enter your name.';
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (!phone || digitsOnly.length < 10 || digitsOnly.length > 13) {
    errors.phone = 'Please enter a valid 10-digit phone number.';
  }

  if (!message || message.length < 3) {
    errors.message = 'Please enter your message.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppEnquiryUrl(values: ContactFormValues): string {
  const lines = [
    DEFAULT_WHATSAPP_MESSAGE,
    '',
    `Name: ${values.name.trim()}`,
    `Phone: ${values.phone.trim()}`,
    `Message: ${values.message.trim()}`,
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function calculateActiveSlideIndex(scrollLeft: number, slideWidth: number, totalSlides: number): number {
  if (slideWidth <= 0 || totalSlides <= 1) return 0;
  const rawIndex = Math.round(scrollLeft / slideWidth);
  return Math.max(0, Math.min(totalSlides - 1, rawIndex));
}
