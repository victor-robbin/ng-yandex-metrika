import { isPlatformBrowser } from '@angular/common';
import { CounterConfig } from './ng-yandex-metrika.config';

/** YM global type: callable + props used by tag bootstrapper */
type YandexEvent = ((...args: any[]) => void) & { a?: any[]; l?: number };

/** Picks the default counter ID from provided configs (with optional explicit index/id) */
export function defineDefaultId(
  counterConfigs: CounterConfig | CounterConfig[],
  defaultCounter?: number
): number | undefined {
  const configs = Array.isArray(counterConfigs) ? counterConfigs : [counterConfigs];
  let defaultId: number | undefined;

  if (!defaultCounter && defaultCounter !== 0) {
    defaultId = configs[0]?.id;
  } else if (defaultCounter < configs.length) {
    defaultId = configs[defaultCounter]?.id;
  } else {
    // treat defaultCounter as a raw id
    defaultId = defaultCounter as number;
  }

  if (!defaultId) {
    console.warn('You provided wrong counter id as a default:', defaultCounter);
    return;
  }

  let exists = false;
  for (const cfg of configs) {
    if (!cfg?.id) {
      console.warn('You should provide counter id to use Yandex.Metrika counter', cfg);
      continue;
    }
    if (cfg.id === defaultId) exists = true;
  }

  if (!exists) {
    console.warn('You provided wrong counter id as a default:', defaultCounter);
  }
  return defaultId;
}

/** Angular APP_INITIALIZER factory: on browser inserts Metrika, on SSR no-op */
export function appInitializerFactory(
  counterConfigs: CounterConfig[],
  platformId: Object,
  alternativeUrl?: string
): () => void {
  if (isPlatformBrowser(platformId)) {
    return insertMetrika.bind(null, counterConfigs, alternativeUrl);
  }
  // SSR path: return a no-op initializer
  return () => {};
}

/** Ensure window.ym exists with the required shape */
function ensureYm(): YandexEvent {
  const anyWin = window as any;
  if (typeof anyWin.ym === 'function' && 'l' in anyWin.ym) {
    return anyWin.ym as YandexEvent;
  }
  const ymShim = ((...args: any[]) => {
    (ymShim.a = ymShim.a || []).push(args);
  }) as YandexEvent;
  ymShim.a = [];
  ymShim.l = Date.now();
  anyWin.ym = ymShim as YandexEvent;
  return ymShim;
}

/** Inject tag.js and init all provided counters */
function insertMetrika(counterConfigs: CounterConfig[], alternativeUrl?: string): void {
  const ym = ensureYm();

  // inject once
  if (!document.querySelector('script[data-ym-tag]')) {
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = alternativeUrl ?? 'https://mc.yandex.ru/metrika/tag.js';
    script.async = true;
    script.setAttribute('data-ym-tag', 'true');
    (firstScript?.parentNode || document.head || document.body).insertBefore(script, firstScript || null);
  }

  for (const { id, ...cfg } of counterConfigs) {
    if (id) ym(id, 'init', cfg as any);
  }
}
