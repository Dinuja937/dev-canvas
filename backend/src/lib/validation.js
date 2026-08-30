const MAX = {
  title: 120,
  description: 3000,
  tag: 40,
  bio: 500,
  technology: 60,
  location: 100,
  institute: 150,
  contactNumber: 30,
  name: 100,
  imageUrl: 2048,
};

const isPlainString = (value) => typeof value === 'string';

export const requiredText = (value, field, maxLength) => {
  if (!isPlainString(value)) throw new Error(`${field} must be text`);
  const text = value.trim();
  if (!text) throw new Error(`${field} is required`);
  if (text.length > maxLength) throw new Error(`${field} is too long`);
  return text;
};

export const optionalText = (value, field, maxLength) => {
  if (value === undefined || value === null || value === '') return '';
  return requiredText(value, field, maxLength);
};

export const optionalHttpUrl = (value, field) => {
  if (value === undefined || value === null || value === '') return '';
  if (!isPlainString(value) || value.length > MAX.imageUrl) throw new Error(`${field} must be a valid URL`);
  let url;
  try { url = new URL(value); } catch { throw new Error(`${field} must be a valid URL`); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`${field} must use HTTP or HTTPS`);
  return url.toString();
};

export const parseTags = (value) => {
  if (value === undefined || value === '') return [];
  const tags = isPlainString(value) ? value.split(',') : value;
  if (!Array.isArray(tags) || tags.length > 15) throw new Error('Tags must contain at most 15 text values');
  return [...new Set(tags.map((tag) => requiredText(tag, 'Tag', MAX.tag)))];
};

export const parseTechnologies = (value) => {
  if (value === undefined || value === '') return [];
  const items = isPlainString(value) ? value.split(',') : value;
  if (!Array.isArray(items) || items.length > 25) throw new Error('Technologies must contain at most 25 text values');
  return [...new Set(items.map((item) => requiredText(item, 'Technology', MAX.technology)))];
};

export const limits = MAX;
