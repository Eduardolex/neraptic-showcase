import { useEffect, useReducer, useRef, useState } from 'react';
import { BrandMark, Icon } from './Icon';
import { CORE_WORDS, MAX_WORDS, PAGES, WORDS, composerReducer, initialComposer, messageText } from './model.js';
import type { Locale, PageId } from './model.js';
import { useSpeech } from './useSpeech';

const COPY = {
  en: {
    eyebrow: 'A SMALL LOOK INSIDE NERAPTIC', title: 'A little space for', accent: 'your words.',
    intro: 'Choose a word. Build a message. Make a connection. Explore a small, bilingual communication board inspired by Neraptic.',
    source: 'View the code', sample: 'Interactive showcase', board: 'Your communication board',
    language: 'Board language', message: 'YOUR MESSAGE', empty: 'What would you like to say?',
    hint: 'Tap the words below to start. Tap a word here to remove it.',
    undo: 'Undo', clear: 'Clear', speak: 'Speak message', stop: 'Stop speaking',
    core: 'A few words, always here', coreNote: 'CORE WORDS', everyday: 'Everyday', feelings: 'Feelings',
    vocabulary: 'Explore your words', page: 'Page', add: 'Add', remove: 'Remove', open: 'Open',
    nextPage: 'More words', previousPage: 'Back to everyday', limit: 'Your message has 24 words. Remove a word to add another.',
    ready: 'Ready when you are. Speech uses a voice provided by your browser or device.',
    noVoices: 'No speech voices are available yet. You can still build a message; check your browser or device voice settings.',
    noMatch: 'No English speech voice is available. You can still build a message or switch languages.',
    unsupported: 'Speech is not supported in this browser. Your message board still works.',
    speaking: 'Speaking your message…', done: 'Message spoken. Your words are still here.',
    stopped: 'Speech stopped. Your words are still here.', error: 'Speech could not play. Check your device sound and voice settings, then try again.',
    aboutLabel: 'SMALL BY DESIGN', about: 'One idea. A few thoughtful details.',
    detail1: 'Familiar places', body1: 'Core words stay in place as you explore. Each page keeps a predictable grid.',
    detail2: 'Two ways to say it', body2: 'Switch between English and Spanish. Your chosen words follow along.',
    detail3: 'Room to explore', body3: 'No account or API key. Messages stay in this session and reset on refresh.',
    disclaimer: 'A small interactive example with original illustrations. Explore the full Neraptic app for more.',
    privacy: 'Speech is optional. Your browser or operating system may use an online voice service.',
    fullProduct: 'Explore Neraptic', footer: 'A small example of a bigger idea.',
  },
  es: {
    eyebrow: 'UNA PEQUEÑA MIRADA A NERAPTIC', title: 'Un espacio para', accent: 'tus palabras.',
    intro: 'Elige una palabra. Crea un mensaje. Conecta. Explora un pequeño tablero de comunicación bilingüe inspirado en Neraptic.',
    source: 'Ver el código', sample: 'Demo interactiva', board: 'Tu tablero de comunicación',
    language: 'Idioma del tablero', message: 'TU MENSAJE', empty: '¿Qué te gustaría decir?',
    hint: 'Toca las palabras de abajo para empezar. Toca una palabra aquí para quitarla.',
    undo: 'Deshacer', clear: 'Borrar', speak: 'Leer mensaje', stop: 'Detener voz',
    core: 'Palabras que siempre están aquí', coreNote: 'PALABRAS CLAVE', everyday: 'Día a día', feelings: 'Emociones',
    vocabulary: 'Explora tus palabras', page: 'Página', add: 'Agregar', remove: 'Quitar', open: 'Abrir',
    nextPage: 'Más palabras', previousPage: 'Volver a día a día', limit: 'Tu mensaje tiene 24 palabras. Quita una para agregar otra.',
    ready: 'Cuando quieras. La voz la proporciona tu navegador o dispositivo.',
    noVoices: 'Todavía no hay voces disponibles. Puedes crear un mensaje; revisa la configuración de voz del navegador o dispositivo.',
    noMatch: 'No hay una voz en español disponible. Puedes crear un mensaje o cambiar de idioma.',
    unsupported: 'Este navegador no admite voz. Tu tablero de comunicación sigue funcionando.',
    speaking: 'Leyendo tu mensaje…', done: 'Mensaje leído. Tus palabras siguen aquí.',
    stopped: 'Voz detenida. Tus palabras siguen aquí.', error: 'No se pudo leer el mensaje. Revisa el sonido y las voces del dispositivo e inténtalo de nuevo.',
    aboutLabel: 'PEQUEÑO A PROPÓSITO', about: 'Una idea. Detalles que importan.',
    detail1: 'Lugares familiares', body1: 'Las palabras clave se quedan en su lugar. Cada página conserva una cuadrícula predecible.',
    detail2: 'Dos formas de decirlo', body2: 'Cambia entre inglés y español. Tus palabras cambian contigo.',
    detail3: 'Espacio para explorar', body3: 'Sin cuenta ni clave de API. Los mensajes duran esta sesión y se borran al recargar.',
    disclaimer: 'Un pequeño ejemplo interactivo con ilustraciones originales. Descubre más en la aplicación Neraptic.',
    privacy: 'La voz es opcional. Tu navegador o sistema operativo puede usar un servicio de voz en línea.',
    fullProduct: 'Explorar Neraptic', footer: 'Un pequeño ejemplo de una gran idea.',
  },
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [page, setPage] = useState<PageId>('everyday');
  const [composer, dispatch] = useReducer(composerReducer, undefined, initialComposer);
  const composerRegion = useRef<HTMLElement>(null);
  const chipButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingChipFocus = useRef<number | null>(null);
  const firstVocabularyWord = useRef<HTMLButtonElement>(null);
  const vocabularyGrid = useRef<HTMLDivElement>(null);
  const pendingPageFocus = useRef(false);
  const speech = useSpeech(locale);
  const t = COPY[locale];
  const text = messageText(composer.words, locale);
  const atLimit = composer.words.length >= MAX_WORDS;
  const speechStatus = speech.availability !== 'ready' ? speech.availability : speech.status === 'idle' ? 'ready' : speech.status;

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  useEffect(() => {
    if (pendingChipFocus.current === null) return;
    const nextIndex = Math.min(pendingChipFocus.current, composer.words.length - 1);
    pendingChipFocus.current = null;
    if (nextIndex >= 0) chipButtons.current[nextIndex]?.focus();
    else composerRegion.current?.focus();
  }, [composer.words]);

  useEffect(() => {
    if (!pendingPageFocus.current) return;
    pendingPageFocus.current = false;
    if (firstVocabularyWord.current && !firstVocabularyWord.current.disabled) firstVocabularyWord.current.focus();
    else vocabularyGrid.current?.focus();
  }, [page]);

  function removeWord(index: number) {
    pendingChipFocus.current = index;
    dispatch({ type: 'remove', index });
  }

  function openLinkedPage(pageId: PageId) {
    pendingPageFocus.current = true;
    setPage(pageId);
  }

  function addWord(wordId: string) {
    dispatch({ type: 'add', wordId });
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#communication-board">{t.board}</a>
      <header className="site-header">
        <a className="brand" href="https://neraptic.com" target="_blank" rel="noreferrer"><BrandMark /><span>neraptic<span className="brand-sub">THE SHOWCASE</span></span></a>
        <a className="source-link" href="https://github.com/Eduardolex/neraptic-showcase" target="_blank" rel="noreferrer">{t.source}<Icon name="arrow" /></a>
      </header>

      <main>
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span className="tiny-star">✳</span>{t.eyebrow}</p>
            <h1 id="page-title">{t.title}<br /><em>{t.accent}</em></h1>
          </div>
          <div className="intro-aside"><p>{t.intro}</p><span className="demo-label"><span />{t.sample}<span className="demo-divider">/</span>01</span></div>
        </section>

        <section className="board" id="communication-board" aria-label={t.board} tabIndex={-1}>
          <div className="board-topbar">
            <div className="board-heading"><span className="board-dot" /><h2>{t.board}</h2></div>
            <div className="language-control" role="group" aria-label={t.language}>
              <Icon name="globe" />
              <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')} lang="en">English</button>
              <button type="button" aria-pressed={locale === 'es'} onClick={() => setLocale('es')} lang="es">Español</button>
            </div>
          </div>

          <div className="board-body">
            <section className="composer" aria-label={t.message} ref={composerRegion} tabIndex={-1}>
              <div className="composer-meta"><span className="eyebrow">{t.message}</span><div className="edit-actions">
                <button type="button" onClick={() => dispatch({ type: 'undo' })} disabled={!composer.history.length}><Icon name="undo" />{t.undo}</button>
                <button type="button" onClick={() => dispatch({ type: 'clear' })} disabled={!composer.words.length}><Icon name="trash" />{t.clear}</button>
              </div></div>
              <div className="message-row">
                <div className="message-content">
                  {composer.words.length ? <ol className="message-chips" aria-label={t.message}>
                    {composer.words.map((id, index) => <li key={`${index}-${id}`}><button type="button" className={`message-chip color-${WORDS[id].color}`} ref={(element) => { chipButtons.current[index] = element; }} onClick={() => removeWord(index)} aria-label={`${t.remove} ${WORDS[id][locale]} (${index + 1})`}><Icon name={WORDS[id].icon} /><span>{WORDS[id][locale]}</span><span className="chip-cross" aria-hidden="true">×</span></button></li>)}
                  </ol> : <p className="message-placeholder">{t.empty}</p>}
                  <p className="composer-hint">{atLimit ? t.limit : t.hint}</p>
                </div>
                <button type="button" className={`speak-button ${speech.status === 'speaking' ? 'is-speaking' : ''}`} disabled={speech.status !== 'speaking' && (!text || speech.availability !== 'ready')} onClick={() => speech.status === 'speaking' ? speech.stop() : speech.speak(text)}><Icon name={speech.status === 'speaking' ? 'stop' : 'speaker'} /><span>{speech.status === 'speaking' ? t.stop : t.speak}</span></button>
              </div>
              <p className={`speech-status ${speech.status === 'error' ? 'status-error' : ''}`} role="status"><span aria-hidden="true" />{t[speechStatus]}</p>
            </section>

            <section className="core-section" aria-labelledby="core-title">
              <div className="section-heading"><h3 id="core-title">{t.core}</h3><span>{t.coreNote}</span></div>
              <div className="core-grid">{CORE_WORDS.map((id) => <button type="button" key={id} className={`word-tile core-tile color-${WORDS[id].color}`} disabled={atLimit} onClick={() => addWord(id)} aria-label={`${t.add} ${WORDS[id][locale]}`}><Icon name={WORDS[id].icon} /><span>{WORDS[id][locale]}</span></button>)}</div>
            </section>

            <section className="vocabulary-section" aria-labelledby="vocabulary-title">
              <div className="vocabulary-heading"><h3 className="sr-only" id="vocabulary-title">{t.vocabulary}</h3>
                <div className="page-controls" role="group" aria-label={t.vocabulary}>{(['everyday', 'feelings'] as const).map((id) => <button type="button" key={id} aria-pressed={page === id} onClick={() => setPage(id)}><Icon name={id === 'everyday' ? 'home' : 'happy'} />{t[id]}</button>)}</div>
                <span className="page-counter">{t.page} <strong>{page === 'everyday' ? '01' : '02'}</strong><span>/ 02</span></span>
              </div>
              <div className="vocabulary-grid" aria-label={t[page]} role="group" ref={vocabularyGrid} tabIndex={-1}>{PAGES[page].map((slot, index) => slot.kind === 'word' ? <button type="button" key={`${page}-${index}`} className={`word-tile color-${WORDS[slot.wordId].color}`} disabled={atLimit} ref={index === 0 ? firstVocabularyWord : undefined} onClick={() => addWord(slot.wordId)} aria-label={`${t.add} ${WORDS[slot.wordId][locale]}`}><span className="icon-field"><Icon name={WORDS[slot.wordId].icon} /></span><span>{WORDS[slot.wordId][locale]}</span></button> : <button type="button" key={`${page}-${index}`} className="word-tile navigation-tile" onClick={() => openLinkedPage(slot.pageId)} aria-label={`${t.open} ${t[slot.pageId]}`}><span className="icon-field"><Icon name="arrow" /></span><span>{t[slot.pageId]}</span><small>{slot.pageId === 'feelings' ? t.nextPage : t.previousPage}</small></button>)}</div>
            </section>
          </div>
          <div className="board-bottom"><span aria-hidden="true">✳</span><p>{t.disclaimer}</p><span className="board-edition">NERAPTIC / 001</span></div>
        </section>

        <section className="about" aria-labelledby="about-title">
          <div className="about-heading"><p className="eyebrow">{t.aboutLabel}</p><h2 id="about-title">{t.about}</h2></div>
          <div className="detail-grid">{([1, 2, 3] as const).map((number) => <article key={number}><span className="detail-number">0{number}</span><h3>{t[`detail${number}`]}</h3><p>{t[`body${number}`]}</p></article>)}</div>
        </section>
      </main>
      <footer className="site-footer"><div><strong>neraptic</strong><span>{t.footer}</span></div><a href="https://neraptic.com" target="_blank" rel="noreferrer">{t.fullProduct}<Icon name="arrow" /></a><p>{t.privacy}</p></footer>
    </div>
  );
}
