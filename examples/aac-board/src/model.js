/** @typedef {'en' | 'es'} Locale */
/** @typedef {'everyday' | 'feelings'} PageId */
/** @typedef {{ en: string, es: string, icon: string, color: string }} Word */
/** @type {Record<string, Word>} */
export const WORDS = {
  i: { en: 'I', es: 'yo', icon: 'person', color: 'peach' },
  want: { en: 'want', es: 'quiero', icon: 'reach', color: 'peach' },
  need: { en: 'need', es: 'necesito', icon: 'heart', color: 'peach' },
  more: { en: 'more', es: 'más', icon: 'plus', color: 'peach' },
  yes: { en: 'yes', es: 'sí', icon: 'check', color: 'green' },
  no: { en: 'no', es: 'no', icon: 'cross', color: 'rose' },
  water: { en: 'water', es: 'agua', icon: 'water', color: 'blue' },
  food: { en: 'food', es: 'comida', icon: 'food', color: 'peach' },
  bathroom: { en: 'bathroom', es: 'baño', icon: 'bathroom', color: 'lavender' },
  rest: { en: 'rest', es: 'descansar', icon: 'rest', color: 'lavender' },
  help: { en: 'help', es: 'ayuda', icon: 'help', color: 'green' },
  play: { en: 'play', es: 'jugar', icon: 'play', color: 'peach' },
  outside: { en: 'outside', es: 'afuera', icon: 'outside', color: 'green' },
  music: { en: 'music', es: 'música', icon: 'music', color: 'lavender' },
  home: { en: 'home', es: 'casa', icon: 'home', color: 'peach' },
  please: { en: 'please', es: 'por favor', icon: 'hands', color: 'rose' },
  thanks: { en: 'thank you', es: 'gracias', icon: 'heart', color: 'rose' },
  happy: { en: 'happy', es: 'feliz', icon: 'happy', color: 'yellow' },
  sad: { en: 'sad', es: 'triste', icon: 'sad', color: 'blue' },
  tired: { en: 'tired', es: 'cansancio', icon: 'tired', color: 'lavender' },
  hurt: { en: 'pain', es: 'dolor', icon: 'hurt', color: 'rose' },
  worried: { en: 'worried', es: 'preocupación', icon: 'worried', color: 'lavender' },
  okay: { en: 'okay', es: 'bien', icon: 'check', color: 'green' },
  hot: { en: 'hot', es: 'calor', icon: 'sun', color: 'peach' },
  cold: { en: 'cold', es: 'frío', icon: 'cold', color: 'blue' },
  excited: { en: 'excited', es: 'emoción', icon: 'spark', color: 'yellow' },
  upset: { en: 'upset', es: 'enojo', icon: 'upset', color: 'rose' },
  calm: { en: 'calm', es: 'calma', icon: 'calm', color: 'green' },
};

export const CORE_WORDS = ['i', 'want', 'need', 'more', 'yes', 'no'];
/** @typedef {{ kind: 'word', wordId: string } | { kind: 'page', pageId: PageId }} Slot */
/** @param {string} wordId @returns {Slot} */
const word = (wordId) => ({ kind: 'word', wordId });
/** @type {Record<PageId, Slot[]>} */
export const PAGES = {
  everyday: [
    ...['water', 'food', 'bathroom', 'rest', 'help', 'play', 'outside', 'music', 'home', 'please', 'thanks'].map(word),
    { kind: 'page', pageId: 'feelings' },
  ],
  feelings: [
    ...['happy', 'sad', 'tired', 'hurt', 'worried', 'okay', 'hot', 'cold', 'excited', 'upset', 'calm'].map(word),
    { kind: 'page', pageId: 'everyday' },
  ],
};

export const MAX_WORDS = 24;
/** @typedef {{ words: string[], history: string[][] }} ComposerState */
/** @typedef {{ type: 'add', wordId: string } | { type: 'remove', index: number } | { type: 'clear' } | { type: 'undo' }} ComposerAction */
/** @returns {ComposerState} */
export const initialComposer = () => ({ words: [], history: [] });

/**
 * Each accepted edit records one snapshot. Undo restores the previous edit,
 * including a clear or removal; ignored actions do not grow history.
 * @param {ComposerState} state
 * @param {ComposerAction} action
 * @returns {ComposerState}
 */
export function composerReducer(state, action) {
  if (action.type === 'undo') {
    if (!state.history.length) return state;
    return { words: state.history[state.history.length - 1], history: state.history.slice(0, -1) };
  }
  /** @type {string[]} */
  let next;
  if (action.type === 'add') {
    if (!Object.hasOwn(WORDS, action.wordId) || state.words.length >= MAX_WORDS) return state;
    next = [...state.words, action.wordId];
  } else if (action.type === 'remove') {
    if (!Number.isInteger(action.index) || action.index < 0 || action.index >= state.words.length) return state;
    next = state.words.filter((_, index) => index !== action.index);
  } else if (action.type === 'clear') {
    if (!state.words.length) return state;
    next = [];
  } else {
    return state;
  }
  return { words: next, history: [...state.history.slice(-49), state.words] };
}

/** @param {string[]} words @param {Locale} locale */
export function messageText(words, locale) {
  return words.filter((id) => Object.hasOwn(WORDS, id)).map((id) => WORDS[id][locale]).join(' ');
}

/** @param {{lang: string}[]} voices @param {Locale} locale */
export function matchingVoice(voices, locale) {
  const fullLocale = locale === 'es' ? 'es-MX' : 'en-US';
  return voices.find((voice) => voice.lang.toLowerCase() === fullLocale.toLowerCase())
    ?? voices.find((voice) => voice.lang.toLowerCase().split(/[-_]/)[0] === locale);
}
