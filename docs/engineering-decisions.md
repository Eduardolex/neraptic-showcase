# Engineering decisions

These decisions explain selected behaviors in Neraptic's current implementation. The public example demonstrates a small part of the design; production-only behavior is labeled explicitly.

## Preserve the structure of a board page

**Problem:** a word lookup can fail, a board can contain deliberate empty positions, and search results can change. Removing empty cells from a grid would move every following word.

**Decision:** represent empty cells explicitly and resolve each original cell into either usable content or an empty placeholder. Production `AacDynamicGrid` maps the original cell array without compacting it. Dynamic search uses its own results view and leaves the underlying page intact.

**Tradeoff:** the interface can display unused space. That space preserves the authored slot order. It does not guarantee identical physical coordinates across devices or every responsive layout.

**In the sample:** six core words and two fully populated, linked pages demonstrate fixed cell order. Production's empty-cell fallback is described here rather than reproduced in the smaller example. Responsive column counts can change the physical position of tiles.

Production references: `src/features/paid-aac/types.ts`, `src/features/paid-aac/components/AacDynamicGrid.tsx`, and `src/pages/PaidAAC.tsx`.

## Use stable word IDs across languages

**Problem:** labels can change with the selected language, while board references still need to identify the same concept.

**Decision:** store word identity separately from translated display text. Production locale definitions supply vocabulary, interface, direction, and voice-language metadata.

**Tradeoff:** translating labels does not automatically solve sentence grammar, pronunciation, or equal voice availability. Six interface locales do not mean six equally available Piper voice sets.

**In the sample:** English and Spanish expose the same small board structure. The composer stores IDs, so an existing message also relabels when the language changes. This demonstrates identity and presentation as separate concerns; it performs word-label substitution, not grammatical sentence translation.

Production reference: `src/features/paid-aac/i18n.ts`.

## Keep speech orchestration outside the board components

**Problem:** speech requests can overlap. Neural voices need initialization, and downloads or synthesis may finish after a person has selected a different message or voice.

**Decision:** production uses a dedicated speech hook for provider selection, preload and warmup, playback, cancellation, and bounded audio caching. Piper session creation is shared so concurrent requests can reuse initialization work.

**Tradeoff:** local neural synthesis adds model download size, startup latency, browser compatibility work, and cache lifecycle management. Browser speech is simpler to start but depends on the voices the device exposes.

**In the sample:** browser speech keeps the example runnable without model files or service credentials. Available voices and audible output must still be checked on the target browser and device.

Production references: `src/features/tts/useManagedTts.ts` and `src/features/tts/piper.ts`.

## Reuse the communication interface for guest access

**Problem:** an account requirement introduces an extra step before someone can try the central communication interaction. A separate guest board implementation would also create two interfaces to maintain.

**Decision:** the current production guest route passes `guestMode` into the shared board component. This selects browser speech and bypasses account data loading and persistence.

**Tradeoff:** the guest experience is transient. It does not currently save a guest draft or transfer that draft into an account. Legacy storage or migration helpers are not evidence that the active guest route offers those features.

**In the sample:** the core interaction is available immediately without authentication. Messages, language, and navigation are held in memory and reset on refresh. This keeps the example's state lifecycle explicit.

Production references: `src/pages/GuestAAC.tsx` and `src/pages/PaidAAC.tsx`.

## Make the public example independently runnable

**Problem:** copying the complete application would make a first run depend on accounts, billing configuration, service credentials, a larger asset library, and deployment-specific setup.

**Decision:** keep this repository focused on an illustrative React and TypeScript example, accompanied by screenshots and a case study of the full system. The sample contains its own small vocabulary and visuals.

**Tradeoff:** the example does not reproduce production vocabulary breadth, board customization, Piper behavior, or backend integrations. The scope table in the README makes those boundaries explicit.

**Verification:** the repository supplies behavior-focused tests and a TypeScript-checked production build. Manual browser review should cover narrow-screen navigation, keyboard access, switching languages, composition, and speech controls. Automated speech-call checks cannot establish the quality or audibility of a device's voice.

## Further validation

Useful next validation work includes observing board navigation with intended users, testing real-device speech and input methods, and reviewing translations with fluent speakers.
