import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_WHATSAPP_MESSAGE,
  buildDefaultWhatsAppUrl,
  validateContactFields,
  buildWhatsAppEnquiryUrl,
  calculateActiveSlideIndex,
} from './enquiry';

test('buildDefaultWhatsAppUrl encodes exact default enquiry message for 916369109409', () => {
  const url = buildDefaultWhatsAppUrl();
  assert.equal(
    DEFAULT_WHATSAPP_MESSAGE,
    'Hi Sir, I came across your real estate and construction business and viewed your property projects. I am interested in knowing more about them. Could we discuss the details?'
  );
  assert.ok(url.startsWith('https://wa.me/916369109409?text='));
  assert.ok(url.includes(encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)));
});

test('validateContactFields rejects empty or invalid 3-field form inputs', () => {
  const result = validateContactFields({
    name: '',
    phone: '12345',
    message: '',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.message);
});

test('validateContactFields accepts valid Name, Phone Number, and Message', () => {
  const result = validateContactFields({
    name: 'Arun Kumar',
    phone: '6369109409',
    message: 'I would like to enquire about plots in Ponneri.',
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('buildWhatsAppEnquiryUrl includes default message and 3-field customer details for 916369109409', () => {
  const url = buildWhatsAppEnquiryUrl({
    name: 'Pradeep Client',
    phone: '9876543210',
    message: 'Need residential construction details.',
  });

  assert.ok(url.startsWith('https://wa.me/916369109409?text='));
  assert.ok(url.includes(encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)));
  assert.ok(url.includes(encodeURIComponent('Name: Pradeep Client')));
  assert.ok(url.includes(encodeURIComponent('Phone: 9876543210')));
  assert.ok(url.includes(encodeURIComponent('Message: Need residential construction details.')));
});

test('calculateActiveSlideIndex computes bounded active pagination index for swipe galleries', () => {
  assert.equal(calculateActiveSlideIndex(0, 360, 2), 0);
  assert.equal(calculateActiveSlideIndex(350, 360, 2), 1);
  assert.equal(calculateActiveSlideIndex(800, 360, 2), 1);
});
