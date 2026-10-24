# AAC board example

A standalone, bilingual communication-board demo for the Neraptic showcase. It uses React 18, TypeScript, Vite, and browser speech. No account, API key, backend, external fonts, or production assets are required.

From the repository root:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4187. Alternatively, run those commands from this directory. Use Node.js 22.12 or later.

```sh
npm test
npm run build
npm run preview
```

The root workspace proxies the sample scripts. The production build is written to `dist/` inside this example; relative asset paths support hosting below a repository subpath.

## Try it

1. Choose **I**, **want**, then **water**.
2. Switch to **Español**. The same word IDs now display **yo quiero agua**.
3. Open **Emociones** using either the page control or the final grid tile; the six core words stay available.
4. Remove a message word, then use **Deshacer** to restore it. Clear can also be undone.
5. Use **Leer mensaje** when a matching device/browser voice is available. During playback it becomes **Detener voz**.

Native buttons support Tab, Enter, and Space. Focus states, semantic regions, pressed states, a skip link, and live speech status support keyboard and assistive-technology use. The app has not undergone a formal accessibility audit.

## Boundaries

- Two fully populated 12-slot pages: Everyday and Feelings. The final slot links to the other page.
- Six fixed core words and a 24-word message limit. Up to 50 edits can be undone.
- English and Spanish labels. Sentence text derives from stable word IDs rather than stored translated strings; this is word-by-word relabeling, not a translation engine.
- All state is transient. Nothing is saved in browser storage; refreshing resets the board, language, and message.
- Browser speech availability depends on installed voices. Unsupported browsers, missing voices, missing language matches, and speech errors have visible status messages. Composition remains available without speech.
- Speech is optional and starts only after a click. The browser or operating system may use an online speech provider; this demo does not promise offline speech.
- Inline SVG illustrations were created for this example. They are illustrative symbols, not a clinically validated AAC symbol set.

## Code map

| File | Responsibility |
| --- | --- |
| `src/model.js` | Vocabulary, fixed slots, pure composer reducer, locale text, voice selection; JSDoc checked by TypeScript |
| `src/App.tsx` | Bilingual interface and interaction flow |
| `src/useSpeech.ts` | Voice discovery, playback, stopping, lifecycle cleanup, visible state |
| `src/Icon.tsx` | Original inline SVG symbols |
| `src/styles.css` | Responsive layout, focus states, reduced-motion handling |
| `tests/model.test.mjs` | Node-native behavioral tests without a browser dependency |

Tests cover switching language while preserving IDs, repeated words, removal and clear recovery, ignored invalid actions, message/history bounds, page integrity, and language-specific voice selection. Browser speech needs separate browser/device verification.
