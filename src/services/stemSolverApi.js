const API_URL = import.meta.env.VITE_API_URL;

export async function analyzeImage(imageDataUrl, signal) {
  if (!API_URL) {
    throw new Error('The solver API is not configured. Set VITE_API_URL and restart the app.');
  }

  let response;
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUrl }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error('Could not reach the solver. Check your connection and try again.');
  }

  if (!response.ok) {
    const messages = {
      400: 'The question image could not be accepted. Try uploading it again.',
      413: 'This image is too large for the solver. Choose an image under 5 MB.',
      429: 'The solver is receiving too many requests. Wait a moment and try again.',
      500: 'The solver ran into a problem. Please try again shortly.',
    };
    throw new Error(messages[response.status] || 'The solver could not process this request. Please try again.');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('The solver returned an unreadable response. Please try again.');
  }

  if (
    !result ||
    typeof result.clean_question !== 'string' ||
    !result.clean_question.trim() ||
    typeof result.ocr_full !== 'string' ||
    typeof result.solution !== 'string' ||
    !result.solution.trim()
  ) {
    throw new Error('The solver returned an incomplete result. Please try again.');
  }

  return {
    clean_question: result.clean_question,
    ocr_full: result.ocr_full,
    solution: result.solution,
  };
}