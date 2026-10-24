import type { ReactNode } from 'react';

/** Original, deliberately simple vector marks; not validated AAC symbols. */
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  let drawing: ReactNode;
  switch (name) {
    case 'person': drawing = <><circle cx="24" cy="15" r="6" /><path d="M13 38v-5a11 11 0 0 1 22 0v5M19 37v-7m10 7v-7" /></>; break;
    case 'reach': drawing = <><path d="M11 35c6-1 9-3 14-10l6-9c2-3 6 0 4 3l-5 9 4-1c4-1 5 3 2 5l-10 7H13" /><path d="m12 14 3-4m5 3 1-5m7 5 3-4" /></>; break;
    case 'heart': drawing = <path d="M24 38 9 24C-3 10 17 4 24 15c7-11 27-5 15 9Z" />; break;
    case 'plus': drawing = <><path d="M24 10v28M10 24h28" /><circle cx="24" cy="24" r="20" strokeOpacity=".16" /></>; break;
    case 'check': drawing = <><circle cx="24" cy="24" r="18" strokeOpacity=".2" /><path d="m14 24 7 7 14-15" /></>; break;
    case 'cross': drawing = <><circle cx="24" cy="24" r="18" strokeOpacity=".2" /><path d="m17 17 14 14m0-14L17 31" /></>; break;
    case 'water': drawing = <><path d="m13 10 3 29h16l3-29ZM16 22c6 4 10-4 18 0" /><path d="M21 8V4h10" /><path d="M21 14v18" strokeOpacity=".3" /></>; break;
    case 'food': drawing = <><circle cx="26" cy="25" r="13" /><circle cx="26" cy="25" r="8" strokeOpacity=".25" /><path d="M5 9v11m5-11v11m-5-5h5M8 20v20M43 9v31m0-31c-5 0-5 13 0 13" /></>; break;
    case 'bathroom': drawing = <><rect x="10" y="7" width="28" height="34" rx="3" /><circle cx="24" cy="17" r="3" /><path d="M24 23v10m-5-10h10m-5 10-4 6m4-6 4 6" /></>; break;
    case 'rest': drawing = <><path d="M7 37V14m0 15h34v8M12 23h8a5 5 0 0 1 5 6m-5-6v-5h15a6 6 0 0 1 6 6v5" /><path d="m26 7 7 0-7 7h7" strokeOpacity=".5" /></>; break;
    case 'help': drawing = <><circle cx="24" cy="24" r="18" /><circle cx="24" cy="24" r="8" /><path d="m11 11 7 7m12 12 7 7m0-26-7 7M18 30l-7 7" /></>; break;
    case 'play': drawing = <><path d="m24 5 17 10v19L24 44 7 34V15Zm0 19v20M7 15l17 9 17-9M15 10l18 10" /><circle cx="15" cy="28" r="1.5" fill="currentColor" /><circle cx="32" cy="29" r="1.5" fill="currentColor" /></>; break;
    case 'outside': drawing = <><path d="M25 42V27m-8 15h16M25 6 12 27h26Z" /><circle cx="10" cy="11" r="4" /><path d="M4 42h39" strokeOpacity=".3" /></>; break;
    case 'music': drawing = <><path d="M19 33V12l20-5v21M19 19l20-5" /><ellipse cx="13" cy="35" rx="6" ry="5" /><ellipse cx="33" cy="30" rx="6" ry="5" /></>; break;
    case 'home': drawing = <><path d="m5 23 19-16 19 16M10 20v21h28V20M20 41V28h9v13" /><path d="M31 12V6h6v11" /></>; break;
    case 'hands': drawing = <><path d="M24 8v23l-8 9H7V27l6-13c2-4 6-2 4 2l-3 9 4-3 2-13c1-4 4-4 4-1Zm0 0v23l8 9h9V27l-6-13c-2-4-6-2-4 2l3 9-4-3-2-13c-1-4-4-4-4-1Z" /></>; break;
    case 'happy': case 'sad': case 'tired': case 'worried': case 'upset': case 'calm':
      drawing = <><circle cx="24" cy="24" r="18" />{name === 'calm' || name === 'tired' ? <path d="M14 20h6m8 0h6" /> : <><path d="M17 19v2m14-2v2" />{name === 'upset' ? <path d="m14 14 6 3m8 0 6-3" /> : null}</>}{name === 'sad' || name === 'upset' ? <path d="M17 32q7-9 14 0" /> : name === 'worried' ? <path d="M18 31h12" /> : name === 'tired' ? <ellipse cx="24" cy="31" rx="3" ry="4" /> : <path d="M16 28q8 11 16 0" />}</>; break;
    case 'hurt': drawing = <><path d="m12 7 29 29c4 4-1 10-5 6L7 13c-4-4 1-10 5-6Z" /><path d="m18 18 12 12m-12-6 6-6m0 12 6-6" /><path d="m33 6 1 5m7 1-5 2M8 33l5-1m-1 9 2-5" /></>; break;
    case 'sun': drawing = <><circle cx="24" cy="24" r="10" /><path d="M24 3v6m0 30v6M3 24h6m30 0h6M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4" /></>; break;
    case 'cold': drawing = <><path d="M24 5v38M8 14l32 20M8 34l32-20m-20-8 4 5 4-5m-8 36 4-5 4 5M7 20l6-3-1-7m25 18-6 3 1 7M7 28l6 3-1 7m25-18-6-3 1-7" /></>; break;
    case 'spark': drawing = <><path d="m24 5 5 13 14 6-14 5-5 14-5-14-14-5 14-6Z" /><path d="m38 5 1 4 4 1-4 1-1 4-1-4-4-1 4-1Z" /></>; break;
    case 'arrow': drawing = <path d="M7 24h33M28 12l12 12-12 12" />; break;
    case 'speaker': drawing = <><path d="M7 19h8l11-9v28l-11-9H7ZM33 16q8 8 0 16m6-22q14 14 0 28" /></>; break;
    case 'stop': drawing = <rect x="10" y="10" width="28" height="28" rx="3" fill="currentColor" stroke="none" />; break;
    case 'undo': drawing = <><path d="m18 9-11 11 11 11M8 20h20a12 12 0 1 1 0 24" /></>; break;
    case 'trash': drawing = <><path d="M10 13h28M18 13V7h12v6M14 13l2 28h16l2-28M21 20v14m6-14v14" /></>; break;
    case 'globe': drawing = <><circle cx="24" cy="24" r="18" /><ellipse cx="24" cy="24" rx="8" ry="18" /><path d="M6 24h36" /></>; break;
    default: drawing = <circle cx="24" cy="24" r="15" />;
  }
  return <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>;
}

export function BrandMark() {
  return <svg viewBox="0 0 48 48" className="brand-mark" aria-hidden="true"><rect x="3" y="3" width="42" height="42" rx="14" fill="#174e43" /><path d="M16 32V17c0-5 8-5 8 0v15m0-15c0-5 8-5 8 0v15" fill="none" stroke="#f6d898" strokeWidth="3.5" strokeLinecap="round" /><circle cx="15.9" cy="35.5" r="1.4" fill="#f6d898" /></svg>;
}
