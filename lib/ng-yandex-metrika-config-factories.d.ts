import { CounterConfig } from './ng-yandex-metrika.config';
/** Picks the default counter ID from provided configs (with optional explicit index/id) */
export declare function defineDefaultId(counterConfigs: CounterConfig | CounterConfig[], defaultCounter?: number): number | undefined;
/** Angular APP_INITIALIZER factory: on browser inserts Metrika, on SSR no-op */
export declare function appInitializerFactory(counterConfigs: CounterConfig[], platformId: Object, alternativeUrl?: string): () => void;
