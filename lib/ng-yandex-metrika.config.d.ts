import { InjectionToken } from '@angular/core';
import { InitParameters } from './yandex-mterika-tag';
export interface CounterConfig extends InitParameters {
    id: number;
}
export declare const DEFAULT_COUNTER_ID: InjectionToken<number>;
export declare const YANDEX_COUNTERS_CONFIGS: InjectionToken<CounterConfig[]>;
export declare const ALTERNATIVE_URL: InjectionToken<string>;
