import test from 'node:test';
import assert from 'node:assert/strict';
import { CORE_WORDS, MAX_WORDS, PAGES, WORDS, composerReducer, initialComposer, matchingVoice, messageText } from '../src/model.js';

const add = (state, wordId) => composerReducer(state, { type: 'add', wordId });

test('a composed message changes locale without changing its word IDs', () => {
  const state = ['i', 'want', 'water'].reduce(add, initialComposer());
  assert.equal(messageText(state.words, 'en'), 'I want water');
  assert.equal(messageText(state.words, 'es'), 'yo quiero agua');
  assert.deepEqual(state.words, ['i', 'want', 'water']);
});

test('removing one occurrence preserves other repeated words; undo restores it', () => {
  const state = ['more', 'water', 'more'].reduce(add, initialComposer());
  const removed = composerReducer(state, { type: 'remove', index: 0 });
  assert.deepEqual(removed.words, ['water', 'more']);
  assert.deepEqual(composerReducer(removed, { type: 'undo' }).words, state.words);
  assert.deepEqual(state.words, ['more', 'water', 'more'], 'previous state remains immutable');
});

test('undo restores a cleared message and walks back earlier edits', () => {
  const state = ['i', 'need', 'help'].reduce(add, initialComposer());
  const cleared = composerReducer(state, { type: 'clear' });
  assert.deepEqual(cleared.words, []);
  const restored = composerReducer(cleared, { type: 'undo' });
  assert.deepEqual(restored.words, ['i', 'need', 'help']);
  assert.deepEqual(composerReducer(restored, { type: 'undo' }).words, ['i', 'need']);
});

test('unknown IDs, prototype keys, and invalid removals are ignored without history entries', () => {
  const state = add(initialComposer(), 'water');
  for (const wordId of ['not-a-word', 'toString', '__proto__']) assert.equal(add(state, wordId), state);
  for (const index of [-1, 1, 1.5, NaN]) assert.equal(composerReducer(state, { type: 'remove', index }), state);
  assert.equal(messageText(['water', 'toString', 'missing'], 'en'), 'water');
  const empty = initialComposer();
  assert.equal(composerReducer(empty, { type: 'clear' }), empty);
  assert.equal(composerReducer(empty, { type: 'undo' }), empty);
});

test('message length is bounded and removing a word makes space again', () => {
  const full = Array.from({ length: MAX_WORDS }, () => 'water').reduce(add, initialComposer());
  assert.equal(full.words.length, MAX_WORDS);
  assert.equal(add(full, 'food'), full);
  const shorter = composerReducer(full, { type: 'remove', index: 5 });
  const replaced = add(shorter, 'food');
  assert.equal(replaced.words.length, MAX_WORDS);
  assert.equal(replaced.words.at(-1), 'food');
});

test('undo history is bounded after repeated edits', () => {
  let state = initialComposer();
  for (let index = 0; index < 100; index++) {
    state = add(state, 'water');
    state = composerReducer(state, { type: 'clear' });
  }
  assert.equal(state.history.length, 50);
  for (let index = 0; index < 50; index++) state = composerReducer(state, { type: 'undo' });
  assert.equal(state.history.length, 0);
  assert.equal(composerReducer(state, { type: 'undo' }), state);
});

test('board pages preserve 12 valid slots, a final navigation link, and valid core vocabulary', () => {
  assert.equal(CORE_WORDS.length, 6);
  assert.equal(new Set(CORE_WORDS).size, 6);
  for (const id of CORE_WORDS) assert.ok(WORDS[id]);
  for (const [pageId, slots] of Object.entries(PAGES)) {
    assert.equal(slots.length, 12);
    assert.equal(slots.at(-1).kind, 'page');
    for (const slot of slots) {
      if (slot.kind === 'word') {
        assert.ok(WORDS[slot.wordId].en);
        assert.ok(WORDS[slot.wordId].es);
      } else {
        assert.ok(PAGES[slot.pageId]);
        assert.notEqual(slot.pageId, pageId);
      }
    }
    assert.equal(new Set(slots.filter(slot => slot.kind === 'word').map(slot => slot.wordId)).size, 11);
  }
});

test('speech selects preferred locale, then same-language fallback, never unrelated language', () => {
  const voices = [{ lang: 'fr-FR' }, { lang: 'es-ES' }, { lang: 'es-MX' }, { lang: 'en-GB' }];
  assert.equal(matchingVoice(voices, 'es'), voices[2]);
  assert.equal(matchingVoice(voices, 'en'), voices[3]);
  assert.equal(matchingVoice([{ lang: 'ES_es' }], 'es').lang, 'ES_es');
  assert.equal(matchingVoice([{ lang: 'fr-FR' }], 'en'), undefined);
  assert.equal(matchingVoice([], 'es'), undefined);
});
