import { ModuleWithProviders } from '@angular/core';
import { CounterConfig } from './ng-yandex-metrika.config';
import * as i0 from "@angular/core";
type Options = {
    defaultCounter?: number;
    alternativeUrl?: string;
};
export declare class MetrikaModule {
    static forRoot(configs: CounterConfig | CounterConfig[], options?: Options): ModuleWithProviders<MetrikaModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MetrikaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MetrikaModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MetrikaModule>;
}
export {};
