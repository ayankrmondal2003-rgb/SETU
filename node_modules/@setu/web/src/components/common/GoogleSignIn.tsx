import React, { useEffect, useRef, useState } from 'react';
import api from '../../api/client';
import { useTranslation } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

declare global {
  interface Window {
    google?: { accounts: { id: {
      initialize: (options: { client_id: string; nonce: string; callback: (response: { credential: string }) => void; auto_select: boolean }) => void;
      renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
    } } };
  }
}
let sdk: Promise<void> | undefined;
function loadGoogle() {
  if (window.google?.accounts.id) return Promise.resolve();
  if (!sdk) sdk = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); sdk = undefined; reject(new Error('Google sign-in is unavailable.')); };
    document.head.appendChild(script);
  });
  return sdk;
}

export const GoogleSignIn: React.FC<{
  role: 'TOURIST' | 'VENDOR';
  disabled: boolean;
  onCredential: (credential: string) => Promise<void>;
}> = ({ role, disabled, onCredential }) => {
  const { language, translate } = useTranslation();
  const { theme } = useTheme();
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  const busy = useRef(disabled);
  callback.current = onCredential;
  busy.current = disabled;
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  useEffect(() => {
    let cancelled = false;
    setState('loading');
    const node = container.current;
    node?.replaceChildren();
    (async () => {
      try {
        const { data } = await api.get('/auth/google/config');
        if (cancelled) return;
        if (!data.enabled) { setState('unavailable'); return; }
        await loadGoogle();
        if (cancelled || !node || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: data.clientId, nonce: data.nonce, auto_select: false,
          callback: response => { if (!cancelled && !busy.current) void callback.current(response.credential); }
        });
        window.google.accounts.id.renderButton(node, {
          type: 'standard', theme: theme === 'dark' ? 'filled_black' : 'outline',
          size: 'large', shape: 'pill', text: 'continue_with', locale: language,
          width: Math.min(340, node.clientWidth || 280)
        });
        setState('ready');
      } catch { if (!cancelled) setState('unavailable'); }
    })();
    return () => { cancelled = true; node?.replaceChildren(); };
  }, [role, language, theme]);

  return <div className="mt-5 relative z-10">
    <div className="flex items-center gap-3 text-brand-brown/70 text-xs font-sans mb-4">
      <span className="h-px flex-1 bg-brand-gold/25" />{translate('Or')}<span className="h-px flex-1 bg-brand-gold/25" />
    </div>
    {/* Match Google's iframe canvas scheme to preserve transparency. The SDK's
        filled_black/outline option above still controls the visible button theme. */}
    <div ref={container} aria-disabled={disabled} style={{ colorScheme: 'light' }} className={`flex justify-center min-h-0 ${disabled ? 'pointer-events-none opacity-50' : ''}`} />
    {state !== 'ready' && <button type="button" disabled className="w-full py-3 rounded-full border border-brand-gold/30 text-brand-brown bg-cream font-sans text-sm">
      {translate('Continue with Google')}
    </button>}
    {state === 'unavailable' && <p role="status" className="mt-2 text-center text-xs font-sans text-brand-brown/70">{translate('Google sign-in is not available yet. Please use email and password.')}</p>}
  </div>;
};
