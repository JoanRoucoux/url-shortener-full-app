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

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
};
