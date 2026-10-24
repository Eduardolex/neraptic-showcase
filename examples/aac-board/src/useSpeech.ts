import { useEffect, useRef, useState } from 'react';
import { matchingVoice } from './model.js';
import type { Locale } from './model.js';

type SpeechStatus = 'idle' | 'speaking' | 'done' | 'stopped' | 'error';
type SpeechAvailability = 'unsupported' | 'noVoices' | 'noMatch' | 'ready';

export function useSpeech(locale: Locale) {
  const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const generation = useRef(0);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const voice = matchingVoice(voices, locale) as SpeechSynthesisVoice | undefined;
  const availability: SpeechAvailability = !supported ? 'unsupported' : voices.length === 0 ? 'noVoices' : !voice ? 'noMatch' : 'ready';

  useEffect(() => {
    if (!supported) return;
    const refreshVoices = () => setVoices(window.speechSynthesis.getVoices());
    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
  }, [supported]);

  useEffect(() => {
    setStatus('idle');
    return () => {
      generation.current += 1;
      if (supported) window.speechSynthesis.cancel();
      utterance.current = null;
    };
  }, [locale, supported]);

  function stop() {
    generation.current += 1;
    if (supported) window.speechSynthesis.cancel();
    utterance.current = null;
    setStatus('stopped');
  }

  function speak(text: string) {
    if (!text.trim() || availability !== 'ready') return;
    generation.current += 1;
    const currentGeneration = generation.current;
    window.speechSynthesis.cancel();
    const next = new SpeechSynthesisUtterance(text);
    next.lang = locale === 'es' ? 'es-MX' : 'en-US';
    next.voice = voice ?? null;
    next.rate = 0.9;
    next.onend = () => {
      if (generation.current === currentGeneration) {
        setStatus('done');
        utterance.current = null;
      }
    };
    next.onerror = () => {
      if (generation.current === currentGeneration) {
        setStatus('error');
        utterance.current = null;
      }
    };
    // Keep the utterance alive until the browser finishes speaking it.
    utterance.current = next;
    setStatus('speaking');
    try {
      window.speechSynthesis.speak(next);
    } catch {
      setStatus('error');
      utterance.current = null;
    }
  }

  return { availability, status, speak, stop };
}
