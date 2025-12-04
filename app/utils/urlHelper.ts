export const encodeMessage = (message: string): string => {
    return Buffer.from(message).toString('base64');
  };
  
  export const decodeMessage = (encoded: string): string => {
    try {
      return Buffer.from(encoded, 'base64').toString();
    } catch {
      return '';
    }
  };
  