import { inject, Injector, ModuleWithProviders, NgModule, provideAppInitializer } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';

import { Metrika } from './ng-yandex-metrika.service';
import {
  ALTERNATIVE_URL,
  CounterConfig,
  DEFAULT_COUNTER_ID,
  YANDEX_COUNTERS_CONFIGS,
} from './ng-yandex-metrika.config';
import { appInitializerFactory, defineDefaultId } from './ng-yandex-metrika-config-factories';

type Options = {
  defaultCounter?: number;
  alternativeUrl?: string;
};

@NgModule()
export class MetrikaModule {
  static forRoot(configs: CounterConfig | CounterConfig[], options: Options = {}): ModuleWithProviders<MetrikaModule> {
    const { defaultCounter, alternativeUrl } = options;

    return {
      ngModule: MetrikaModule,
      providers: [
        {
          provide: DEFAULT_COUNTER_ID,
          useValue: defineDefaultId(configs, defaultCounter),
        },
        {
          provide: YANDEX_COUNTERS_CONFIGS,
          useValue: Array.isArray(configs) ? configs : [configs],
        },
        {
          provide: ALTERNATIVE_URL,
          useValue: alternativeUrl,
        },
        provideAppInitializer(() => appInitializerFactory(
          inject(YANDEX_COUNTERS_CONFIGS),
          inject(PLATFORM_ID),
          inject(ALTERNATIVE_URL),
        )()),
        {
          provide: Metrika,
          useClass: Metrika,
          deps: [Injector, PLATFORM_ID],
        },
      ],
    };
  }
}
