import { randomBytes } from 'crypto';

export const isValidUrl = (value: string): boolean => {
  const pattern: RegExp = new RegExp(
    '^https?:\\/\\/' + // Protocol (http or https)
      '(?:www\\.)?' + // Optional www.
      '[-a-zA-Z0-9@:%._\\+~#=]{1,256}' + // Domain name characters
      '\\.[a-zA-Z0-9()]{1,6}\\b' + // Top-level domain
      '(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$', // Optional query string
    'i' // Case-insensitive flag
  );

  return pattern.test(value);
};

export const generateBase64Token = (length: number): string => {
  const buffer = randomBytes(Math.ceil((length * 3) / 4)); // Generate enough random bytes
  return buffer
    .toString('base64') // Convert to Base64
    .replace(/\+/g, '-') // URL-safe: replace + with -
    .replace(/\//g, '_') // URL-safe: replace / with _
    .replace(/=+$/, '') // Remove padding
    .slice(0, length); // Ensure fixed length
};
