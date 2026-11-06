const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export function validateImageFile(file) {
  if (!file) return 'Choose an image of a question before analyzing.';
  if (!ALLOWED_TYPES.has(file.type)) return 'Unsupported file type. Choose a PNG, JPG, JPEG, or WEBP image.';
  if (file.size > MAX_FILE_SIZE) return 'This image is larger than 5 MB. Choose a smaller image.';
  return '';
}

export function fileToDataUrl(file, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('The operation was aborted.', 'AbortError'));
      return;
    }

    const reader = new FileReader();
    const cleanup = () => signal?.removeEventListener('abort', handleAbort);
    const handleAbort = () => {
      reader.abort();
      cleanup();
    };

    reader.onload = () => {
      cleanup();
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('The selected image could not be read.'));
    };
    reader.onerror = () => {
      cleanup();
      reject(new Error('The selected image could not be read.'));
    };
    reader.onabort = () => {
      cleanup();
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    signal?.addEventListener('abort', handleAbort, { once: true });
    reader.readAsDataURL(file);
  });
}