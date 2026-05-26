export function parseError(err: any): string {
  if (!err.error) return 'Something went wrong. Please try again.';

  const error = err.error;

  // Django field errors object
  // e.g. { "email": ["already exists"], "number": ["This field is required"] }
  if (typeof error === 'object' && !Array.isArray(error)) {
    const messages: string[] = [];

    for (const field in error) {
      const fieldErrors = error[field];
      const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((msg: string) => messages.push(`${fieldName}: ${msg}`));
      } else {
        messages.push(`${fieldName}: ${fieldErrors}`);
      }
    }

    return messages.join('\n');
  }

  if (typeof error === 'string') return error;
  if (error.detail) return error.detail;

  return 'Something went wrong. Please try again.';
}
