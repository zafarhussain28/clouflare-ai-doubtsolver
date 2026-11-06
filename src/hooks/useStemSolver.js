import { useEffect, useRef, useState } from 'react';
import { analyzeImage } from '../services/stemSolverApi.js';
import { fileToDataUrl } from '../utils/imageUtils.js';

const REQUEST_TIMEOUT_MS = 90_000;

export function useStemSolver() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const solve = async (file) => {
    if (controllerRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const imageDataUrl = await fileToDataUrl(file, controller.signal);
      const analysis = await analyzeImage(imageDataUrl, controller.signal);
      setResult(analysis);
    } catch (requestError) {
      if (timedOut) {
        setError('Analysis took longer than expected and timed out. Please try again.');
      } else if (controller.signal.aborted) {
        setError('Analysis cancelled. You can try again when you are ready.');
      } else {
        setError(requestError.message || 'Something went wrong while analyzing the image. Please try again.');
      }
    } finally {
      window.clearTimeout(timeout);
      controllerRef.current = null;
      setLoading(false);
    }
  };

  const cancel = () => controllerRef.current?.abort();
  const clear = () => {
    setResult(null);
    setError('');
  };

  return { solve, cancel, clear, result, error, loading };
}