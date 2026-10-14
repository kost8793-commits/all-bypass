/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';

// Accents and storage keys
const ACCENTS = ['#4c8dff', '#2fd6b0', '#ff8a65', '#ff6fd8', '#ffc94d'];
const K_HIST = 'safelinku_hist';
const K_THEME = 'safelinku_theme';
const K_SVC = 'bypass_service';

interface ThemeState {
  mode: 'dark' | 'light';
  acc: string;
}

interface HistItem {
  input: string;
  final: string;
  t: number;
}

interface ToastItem {
  id: number;
  msg: string;
  type: 'ok' | 'err';
  out?: boolean;
}

interface ServiceDef {
  name: string;
  ph: string;
  label?: string;
  bare?: RegExp;
  ic: React.ReactNode;
}

const SERVICES: Record<string, ServiceDef> = {
  safelinku: {
    name: 'Safelinku',
    ph: 'https://sfl.gl/D0Ze5',
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6z" />
        <path d="m9 12 2.2 2.2L15.5 10" />
      </svg>
    ),
  },
  link2unlock: {
    name: 'Link2Unlock',
    ph: 'https://link2unlock.com/AbC12',
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2.5" />
        <path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />
        <path d="M12 15v2.5" />
      </svg>
    ),
  },
  sub4unlock: {
    name: 'Sub4Unlock',
    ph: 'https://sub4unlock.co/I9zoNVN',
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
        <path d="M10 21h4" />
      </svg>
    ),
  },
  platoboost: {
    name: 'Platoboost',
    label: 'Key',
    ph: 'https://auth.platorelay.com/a?d=...',
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="15" r="4" />
        <path d="m11 12 9-9M16 7l3 3M14 9l2 2" />
      </svg>
    ),
  },
  linkvertise: {
    name: 'Linkvertise',
    ph: 'https://linkvertise.com/119714/EzHub',
    bare: /^\d+\/[\w-]+$/,
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
      </svg>
    ),
  },
  tpili: {
    name: 'tpi.li',
    ph: 'https://tpi.li/go',
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
      </svg>
    ),
  },
  sub2unlock: {
    name: 'Sub2Unlock',
    ph: 'https://sub2unlock.com/hYTuA',
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    ),
  },
  scriptpastebins: {
    name: 'Script Pastebins',
    label: 'Script',
    ph: 'https://scriptpastebins.com/dum-hub-blox-fruits/',
    bare: /^[\w-]+$/,
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
      </svg>
    ),
  },
  pastebin: {
    name: 'Pastebin',
    label: 'Isi Paste',
    ph: 'https://pastebin.com/1PWxczzC',
    bare: /^[A-Za-z0-9]{6,12}$/,
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="3" width="8" height="4" rx="1" />
        <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2M9 13h6M9 17h4" />
      </svg>
    ),
  },
  pastelua: {
    name: 'PasteLua',
    label: 'Script',
    ph: 'https://pastelua.com/k8mp5aw1',
    bare: /^[A-Za-z0-9]{6,12}$/,
    ic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    ),
  },
};

function detectService(url: string, currentSvc: string = 'safelinku'): string {
  const u = (url || '').trim().toLowerCase();
  if (u.includes('sub2unlock')) return 'sub2unlock';
  if (u.includes('sub4unlock')) return 'sub4unlock';
  if (u.includes('linkvertise') || /^\d+\/[\w-]+$/.test(u)) return 'linkvertise';
  if (u.includes('scriptpastebins')) return 'scriptpastebins';
  if (u.includes('pastebin')) return 'pastebin';
  if (u.includes('pastelua')) return 'pastelua';
  if (u.includes('link2unlock')) return 'link2unlock';
  if (u.includes('tpi.li')) return 'tpili';
  if (u.includes('sfl.gl') || u.includes('safelinku')) return 'safelinku';
  if (u.includes('platoboost') || u.includes('platorelay')) return 'platoboost';
  return currentSvc;
}

function normalizeUrl(svc: string, raw: string): string {
  let u = (raw || '').trim();
  if (!u) return '';

  if (svc === 'linkvertise' && !/^https?:\/\//i.test(u)) {
    u = 'https://linkvertise.com/' + u.replace(/^\/+/, '');
  } else if (svc === 'pastebin' && !/^https?:\/\//i.test(u)) {
    u = 'https://pastebin.com/' + u.replace(/^\/+/, '');
  } else if (svc === 'scriptpastebins' && !/^https?:\/\//i.test(u)) {
    u = 'https://scriptpastebins.com/' + u.replace(/^\/+/, '').replace(/\/?$/, '/');
  } else if (svc === 'pastelua' && !/^https?:\/\//i.test(u)) {
    u = 'https://pastelua.com/' + u.replace(/^\/+/, '');
  } else if (svc === 'sub4unlock' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://sub4unlock.co/' + u;
  } else if (svc === 'sub2unlock' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://sub2unlock.com/' + u;
  } else if (svc === 'link2unlock' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://link2unlock.com/' + u;
  } else if (svc === 'safelinku' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://sfl.gl/' + u;
  } else if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(u) && /^[\w.-]+\.[a-z]{2,}\//i.test(u)) {
    u = 'https://' + u;
  }

  return u;
}

function onColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#0b0d1a' : '#ffffff';
}

function parseParts(u: string): { host: string; path: string } {
  try {
    const x = new URL(u);
    return {
      host: x.hostname.replace(/^www\./, ''),
      path: x.pathname + x.search || '/',
    };
  } catch {
    return { host: u, path: '' };
  }
}

function formatAgo(t: number): string {
  if (!t) return '';
  const s = Math.max(1, (Date.now() - t) / 1000);
  if (s < 60) return 'baru saja';
  if (s < 3600) return Math.floor(s / 60) + ' mnt';
  if (s < 86400) return Math.floor(s / 3600) + ' jam';
  return Math.floor(s / 86400) + ' hari';
}

export default function App() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem(K_THEME);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.mode && p.acc) return p;
      }
    } catch {}
    return { mode: 'dark', acc: ACCENTS[0] };
  });

  const [popOpen, setPopOpen] = useState(false);
  const [service, setService] = useState<string>(() => {
    const saved = localStorage.getItem(K_SVC);
    return saved && SERVICES[saved] ? saved : 'safelinku';
  });
  const [svcListOpen, setSvcListOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'busy' | 'done'>('idle');

  const [result, setResult] = useState<{
    show: boolean;
    isText: boolean;
    finalUrl: string;
    text: string;
    inputUrl: string;
    intermediateUrl?: string;
    host: string;
  } | null>(null);

  const [history, setHistory] = useState<HistItem[]>(() => {
    try {
      const h = localStorage.getItem(K_HIST);
      if (h) {
        const parsed = JSON.parse(h);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [, setTick] = useState(0);

  const popRef = useRef<HTMLDivElement>(null);
  const tuneBtnRef = useRef<HTMLButtonElement>(null);
  const pickRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const addToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-1), { id, msg, type }]);

    const duration = type === 'err' ? 3800 : 2000;
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, out: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 240);
    }, duration);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.mode);
    root.style.colorScheme = theme.mode;
    root.style.setProperty('--acc', theme.acc);
    root.style.setProperty('--on-acc', onColor(theme.acc));

    let m = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!m) {
      m = document.createElement('meta');
      m.name = 'theme-color';
      document.head.appendChild(m);
    }
    m.content = theme.mode === 'dark' ? '#000000' : '#f1f2f8';

    try {
      localStorage.setItem(K_THEME, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(K_SVC, service);
    } catch {}
  }, [service]);

  // Pre-warm the endpoint on mount so cookies and connections are active immediately
  useEffect(() => {
    fetch('/api/resolve?warmup=1', { credentials: 'same-origin' }).catch(() => {});
  }, []);

  const saveHistory = (items: HistItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(K_HIST, JSON.stringify(items));
    } catch {}
  };

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        popOpen &&
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        tuneBtnRef.current &&
        !tuneBtnRef.current.contains(e.target as Node)
      ) {
        setPopOpen(false);
      }
      if (
        svcListOpen &&
        pickRef.current &&
        !pickRef.current.contains(e.target as Node)
      ) {
        setSvcListOpen(false);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPopOpen(false);
        setSvcListOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [popOpen, svcListOpen]);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('url');
    if (q) {
      setUrlInput(q);
      const detected = detectService(q, service);
      if (detected !== service) setService(detected);
      executeBypass(q, detected);
    }
  }, []);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      addToast('Tersalin', 'ok');
      return true;
    } catch {
      addToast('Gagal menyalin', 'err');
      return false;
    }
  };

  const handleInputChange = (val: string) => {
    setUrlInput(val);
    const detected = detectService(val, service);
    if (detected !== service) {
      setService(detected);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        const val = text.trim();
        setUrlInput(val);
        const detected = detectService(val, service);
        if (detected !== service) {
          setService(detected);
        }
        addToast('Ditempel', 'ok');
      } else {
        addToast('Clipboard kosong', 'err');
      }
    } catch {
      addToast('Gagal menempel', 'err');
    }
  };

  // Instant single-click resolution with auto-detection & recursive chained bypass
  const executeBypass = async (inputUrlOverride?: string, currentSvc?: string) => {
    let rawInput = (inputUrlOverride !== undefined ? inputUrlOverride : urlInput).trim();
    const curServiceDef = SERVICES[service] || SERVICES.safelinku;

    // Zero-friction: if input is blank, auto-fill with active placeholder
    if (!rawInput) {
      rawInput = curServiceDef.ph;
      setUrlInput(rawInput);
    }

    // Auto-detect service from the actual input
    const detectedSvc = detectService(rawInput, currentSvc || service);
    if (detectedSvc !== service) {
      setService(detectedSvc);
    }
    const svc = detectedSvc;
    const normalized = normalizeUrl(svc, rawInput);

    setIsLoading(true);
    setStatus('busy');

    try {
      let resolvedData: any = null;
      let isSuccess = false;
      let lastErrorMessage = '';

      // Query with automatic retry loop to bypass initial iframe auth bridge check seamlessly
      for (let attempt = 0; attempt < 3 && !isSuccess; attempt++) {
        try {
          const localRes = await fetch(
            `/api/resolve?service=${encodeURIComponent(svc)}&url=${encodeURIComponent(normalized)}`,
            { credentials: 'same-origin' }
          );

          const contentType = localRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await localRes.json();
            const d = json && json.data;
            if (localRes.ok && (d?.finalUrl || d?.primaryUrl || d?.text || d?.script || d?.content)) {
              resolvedData = d;
              isSuccess = true;
              break;
            } else if (json?.message) {
              lastErrorMessage = json.message;
            }
          } else {
            // HTML received (e.g. initial Google Cloud Run cookie check).
            await new Promise((r) => setTimeout(r, 180));
          }
        } catch (localErr) {
          console.warn(`Local resolve attempt ${attempt + 1} failed:`, localErr);
          await new Promise((r) => setTimeout(r, 150));
        }
      }

      // Fallback: If local API didn't return valid data, try upstream resolver
      if (!isSuccess) {
        try {
          const upstreamRes = await fetch(
            `https://tarzbypass.vercel.app/api/resolve?service=${encodeURIComponent(svc)}&url=${encodeURIComponent(normalized)}`
          );
          const contentType = upstreamRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const json = await upstreamRes.json();
            const d = json && json.data;
            if (upstreamRes.ok && (d?.finalUrl || d?.primaryUrl || d?.text || d?.script || d?.content)) {
              resolvedData = d;
              isSuccess = true;
            } else if (json?.message) {
              lastErrorMessage = json.message;
            }
          }
        } catch (upstreamErr) {
          console.warn('Upstream resolve attempt failed:', upstreamErr);
        }
      }

      if (!isSuccess || !resolvedData) {
        throw new Error(lastErrorMessage || 'Link tidak ditemukan atau layanan bermasalah');
      }

      const d = resolvedData;
      if (!d.finalUrl) {
        d.finalUrl = d.primaryUrl || (d.unlocks && d.unlocks[0] && d.unlocks[0].url) || '';
      }

      const isText = !!(!d.finalUrl && (d.text || d.script || d.content));
      const textVal = isText ? (d.text || d.script || d.content || '') : '';

      if (!d.finalUrl && !textVal) {
        throw new Error('Tujuan tidak ditemukan');
      }

      const p = isText
        ? { host: curServiceDef.label || 'Hasil', path: '' }
        : parseParts(d.finalUrl);

      const resolvedObj = {
        show: true,
        isText,
        finalUrl: d.finalUrl || '',
        text: textVal,
        inputUrl: d.inputUrl || normalized,
        intermediateUrl: d.intermediateUrl,
        host: p.host,
      };

      setResult(resolvedObj);
      setStatus('done');

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);

      // Save to history
      if (!isText && d.finalUrl) {
        const updated = history.filter((x) => x.final !== d.finalUrl);
        updated.unshift({
          input: d.inputUrl || normalized,
          final: d.finalUrl,
          t: Date.now(),
        });
        saveHistory(updated.slice(0, 30));
      }
    } catch (err: any) {
      const msg = err && err.message ? err.message : 'Terjadi kesalahan';
      addToast(msg, 'err');
      setStatus('idle');
      setResult((prev) => (prev ? { ...prev, show: false } : null));
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = (key: string) => {
    setService(key);
    setSvcListOpen(false);
    setStatus('idle');
    setResult(null);
    // Don't wipe urlInput so user does not lose input
  };

  const curSvc = SERVICES[service] || SERVICES.safelinku;
  const lastOutput = result?.isText ? result?.text : result?.finalUrl;

  const handleShare = async () => {
    if (!lastOutput) return;
    if (navigator.share) {
      try {
        await navigator.share(
          /^https?:\/\//.test(lastOutput) ? { url: lastOutput } : { text: lastOutput }
        );
      } catch {}
    } else {
      copyText(lastOutput);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="top">
        <div className="head">
          <div className="mark">
            <b aria-hidden="true">
              <svg
                viewBox="0 0 326 285"
                fill="none"
                stroke="url(#lg)"
                strokeWidth="22"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
              >
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0"
                      style={{ stopColor: `color-mix(in srgb, ${theme.acc} 72%, #fff)` }}
                    />
                    <stop offset="1" style={{ stopColor: theme.acc }} />
                  </linearGradient>
                </defs>
                <path d="M136 106H30L80 20h175l42 58" />
                <path d="M190 106h110L163 246 78 148H44" />
                <path
                  fill="url(#lg)"
                  stroke="none"
                  d="M85 55h156v24H177v111l-14 15-14-15V79H85z"
                />
              </svg>
            </b>
            <span>
              All <em>Bypass</em>
            </span>
          </div>

          <div className="tools">
            <button
              ref={tuneBtnRef}
              className="icon"
              id="tune"
              type="button"
              aria-label="Tampilan"
              aria-expanded={popOpen}
              onClick={() => setPopOpen(!popOpen)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Theme Settings Popover */}
        {popOpen && (
          <div ref={popRef} className="pop" id="pop">
            <p>Mode</p>
            <div className="seg">
              <button
                type="button"
                data-mode="dark"
                aria-pressed={theme.mode === 'dark'}
                onClick={() => setTheme((t) => ({ ...t, mode: 'dark' }))}
              >
                Gelap
              </button>
              <button
                type="button"
                data-mode="light"
                aria-pressed={theme.mode === 'light'}
                onClick={() => setTheme((t) => ({ ...t, mode: 'light' }))}
              >
                Terang
              </button>
            </div>
            <p>Warna aksen</p>
            <div className="sw" id="sw">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  data-c={c}
                  style={{ backgroundColor: c }}
                  aria-label={`Warna ${c}`}
                  aria-pressed={theme.acc === c}
                  onClick={() => setTheme((t) => ({ ...t, acc: c }))}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <section
          className={`hero ${status === 'busy' ? 'busy' : ''} ${status === 'done' ? 'done' : ''}`}
          id="hero"
        >
          <h1 className="ttl">
            All <em>Bypass</em> Link
          </h1>
          <p className="tag">Tempel link pendek, dapat alamat aslinya</p>

          {/* Steps tracker */}
          <ol className="steps" aria-hidden="true">
            <li className="st s1">
              <span className="dot">
                <span>
                  <svg
                    className="ic"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="8" y="3" width="8" height="4" rx="1" />
                    <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
                  </svg>
                </span>
                <svg
                  className="ck"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </span>
              <b>Tempel</b>
              <small id="vizA">link {curSvc.name}</small>
            </li>

            <li className="st s2">
              <span className="dot">
                <span>
                  <svg
                    className="ic"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
                  </svg>
                </span>
                <svg
                  className="ck"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </span>
              <b>Bypass</b>
              <small>otomatis</small>
            </li>

            <li className="st s3">
              <span className="dot">
                <span>
                  <svg
                    className="ic"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 4h6v6M20 4l-9 9" />
                    <path d="M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
                  </svg>
                </span>
                <svg
                  className="ck"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
              </span>
              <b>Buka</b>
              <small id="vizB">{result ? result.host : 'alamat asli'}</small>
            </li>
          </ol>

          {/* Form Card */}
          <div className="box" id="card">
            {/* Service Dropdown */}
            <div className="pick" id="pick" ref={pickRef}>
              <span className="lbl">Layanan (Auto-Detect)</span>
              <button
                className="pick-btn"
                id="svcBtn"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={svcListOpen}
                onClick={() => setSvcListOpen(!svcListOpen)}
              >
                <span className="pick-ic" id="svcIc" aria-hidden="true">
                  {curSvc.ic}
                </span>
                <b id="svcName">{curSvc.name}</b>
                <svg
                  className="chev"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {svcListOpen && (
                <ul className="pick-list" id="svcList" role="listbox" aria-label="Layanan">
                  {Object.entries(SERVICES).map(([k, item]) => (
                    <li
                      key={k}
                      role="option"
                      data-svc={k}
                      tabIndex={0}
                      aria-selected={service === k}
                      onClick={() => handleServiceSelect(k)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleServiceSelect(k);
                        }
                      }}
                    >
                      <span className="li-ic">{item.ic}</span>
                      <span>{item.name}</span>
                      <em>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                      </em>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Input Link */}
            <div>
              <label className="lbl" htmlFor="url">
                Input Link
              </label>
              <div className="field">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
                  <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
                </svg>
                <input
                  id="url"
                  type="text"
                  inputMode="text"
                  enterKeyHint="go"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  placeholder={curSvc.ph}
                  aria-label={`Link ${curSvc.name}`}
                  value={urlInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeBypass();
                  }}
                />
                <button
                  className="ghost"
                  id="paste"
                  type="button"
                  aria-label="Tempel dari clipboard"
                  title="Tempel"
                  onClick={handlePaste}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="8" y="2" width="8" height="4" rx="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="go"
              id="go"
              type="button"
              disabled={isLoading}
              onClick={() => executeBypass()}
            >
              {isLoading ? (
                <>
                  <span className="spin" />
                  <span id="goText">Memproses</span>
                </>
              ) : (
                <>
                  <span id="goText">Bypass Link</span>
                  <svg
                    className="arr"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Result Card */}
          {result && result.show && (
            <div ref={resultRef} className="result show" id="result" aria-live="polite">
              <div className="res-top">
                <small>Berhasil dibuka</small>
                <div className="host" id="host">
                  {result.host}
                </div>
              </div>

              {result.intermediateUrl && (
                <div style={{ fontSize: '11px', color: 'var(--mute)', margin: '10px 0 -6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--ok)', fontWeight: 600 }}>2-Hop Bypass Otomatis:</span>
                  <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>{parseParts(result.intermediateUrl).host}</span>
                  <span>➔</span>
                  <span style={{ color: 'var(--acc)', fontWeight: 600 }}>Tujuan Langsung</span>
                </div>
              )}

              <div className="full">
                <span className="k" id="outLbl">
                  {result.isText ? curSvc.label || 'Hasil' : 'Tujuan'}
                </span>
                {result.isText ? (
                  <a id="outUrl" className="txt">
                    {result.text}
                  </a>
                ) : (
                  <a
                    id="outUrl"
                    href={result.finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.finalUrl}
                  </a>
                )}
              </div>

              <div className="from">
                <span className="k">Dari</span>
                <span id="inUrl">{result.inputUrl}</span>
              </div>

              <div className={`acts ${result.isText ? 't' : ''}`}>
                {!result.isText && (
                  <a
                    className="btn main"
                    id="visit"
                    href={result.finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka tujuan{' '}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                )}

                <button
                  className="btn"
                  id="copy"
                  type="button"
                  onClick={() => lastOutput && copyText(lastOutput)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                  </svg>
                  Salin
                </button>

                <button className="btn" id="share" type="button" onClick={handleShare}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                  </svg>
                  Bagikan
                </button>
              </div>
            </div>
          )}
        </section>

        {/* History Section */}
        <section className="sect" id="p-hist" aria-labelledby="h-hist">
          <div className="sec-h">
            <div>
              <h2 id="h-hist">Riwayat</h2>
              <p>Link yang pernah kamu buka</p>
            </div>
            {history.length > 0 && (
              <button
                className="link"
                id="clearHist"
                type="button"
                onClick={() => {
                  saveHistory([]);
                  addToast('Riwayat dihapus', 'ok');
                }}
              >
                Hapus semua
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <ul className="list" id="hist">
              {history.map((it, idx) => {
                const p = parseParts(it.final);
                const firstLetter =
                  p.host.replace(/^[^a-zA-Z0-9]+/, '').charAt(0).toUpperCase() || 'L';
                const isCopied = copiedId === idx;

                return (
                  <li key={it.final + it.t}>
                    <a
                      className="it"
                      href={it.final}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="fav" aria-hidden="true">
                        {firstLetter}
                      </span>
                      <span className="t">
                        <span className="d">{p.host}</span>
                        <span className="p">{p.path}</span>
                      </span>
                    </a>
                    <span className="ago">{formatAgo(it.t)}</span>
                    <button
                      type="button"
                      className="mini"
                      aria-label="Salin link"
                      onClick={async () => {
                        const ok = await copyText(it.final);
                        if (ok) {
                          setCopiedId(idx);
                          setTimeout(() => setCopiedId(null), 1200);
                        }
                      }}
                    >
                      {isCopied ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="9" y="9" width="12" height="12" rx="2" />
                          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      className="mini del"
                      aria-label="Hapus dari riwayat"
                      onClick={() => {
                        const filtered = history.filter((y) => y.final !== it.final);
                        saveHistory(filtered);
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty" id="histEmpty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <b>Belum ada riwayat</b>
              Tempel link di atas, hasilnya tersimpan di sini.
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="foot">
          All <em>Bypass</em>
        </footer>
      </main>

      {/* Floating Toasts */}
      <div className="toasts" id="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type === 'err' ? 'err' : ''} ${t.out ? 'out' : ''}`}
            role={t.type === 'err' ? 'alert' : 'status'}
          >
            <i>
              {t.type === 'err' ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 6v7M12 18h.01" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12 5 5 9-10" />
                </svg>
              )}
            </i>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
