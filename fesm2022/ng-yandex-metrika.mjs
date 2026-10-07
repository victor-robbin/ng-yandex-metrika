import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Input, Directive, Injector, PLATFORM_ID, provideAppInitializer, inject, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const DEFAULT_COUNTER_ID = new InjectionToken('DEFAULT_COUNTER_ID');
const YANDEX_COUNTERS_CONFIGS = new InjectionToken('YANDEX_COUNTERS_CONFIGS');
const ALTERNATIVE_URL = new InjectionToken('ALTERNATIVE_URL');

class Metrika {
    constructor(injector) {
        this.fireEvent = this.reachGoal;
        this.defaultCounterId = injector.get(DEFAULT_COUNTER_ID);
        this.counterConfigs = injector.get(YANDEX_COUNTERS_CONFIGS);
    }
    addFileExtension(extensions, counterId) {
        window.ym(counterId ?? this.defaultCounterId, 'addFileExtension', extensions);
    }
    extLink(url, options = {}, counterId) {
        const promise = this.getCallbackPromise(options);
        window.ym(counterId ?? this.defaultCounterId, 'extLink', url, options);
        return promise;
    }
    file(url, options = {}, counterId) {
        const promise = this.getCallbackPromise(options);
        window.ym(counterId ?? this.defaultCounterId, 'file', url, options);
        return promise;
    }
    getClientID(counterId) {
        return new Promise((resolve) => {
            window.ym(counterId ?? this.defaultCounterId, 'getClientID', resolve);
        });
    }
    setUserID(userId, counterId) {
        window.ym(counterId ?? this.defaultCounterId, 'setUserID', userId);
    }
    userParams(parameters, counterId) {
        window.ym(counterId ?? this.defaultCounterId, 'userParams', parameters);
    }
    params(parameters, counterId) {
        window.ym(counterId ?? this.defaultCounterId, 'params', parameters);
    }
    replacePhones(counterId) {
        window.ym(counterId ?? this.defaultCounterId, 'replacePhones');
    }
    async notBounce(options, counterId) {
        const promise = this.getCallbackPromise(options);
        window.ym(counterId ?? this.defaultCounterId, 'notBounce', options);
        return promise;
    }
    reachGoal(target, params = undefined, callback = () => { }, ctx = undefined, counterId) {
        const options = { callback, ctx };
        const promise = this.getCallbackPromise(options);
        window.ym(counterId ?? this.defaultCounterId, 'reachGoal', target, params, options.callback, options.ctx);
        return promise;
    }
    hit(url, options = {}, counterId) {
        const promise = this.getCallbackPromise(options);
        window.ym(counterId ?? this.defaultCounterId, 'hit', url, options);
        return promise;
    }
    getCallbackPromise(options) {
        return new Promise((resolve) => {
            const optionsCallback = options.callback;
            options.callback = function () {
                if (optionsCallback) {
                    optionsCallback.call(this);
                }
                resolve(this);
            };
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: Metrika, deps: [{ token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: Metrika, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: Metrika, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i0.Injector }] });

class MetrikaGoalDirective {
    constructor(metrika, renderer, el) {
        this.metrika = metrika;
        this.renderer = renderer;
        this.el = el;
        this.eventName = 'click';
    }
    ngAfterViewInit() {
        try {
            this.removeEventListener = this.renderer.listen(this.el.nativeElement, this.eventName, () => {
                const options = { callback: this.callback, ...this.params };
                this.metrika.reachGoal(this.goalName, options, undefined, undefined, this.counterId);
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    ngOnDestroy() {
        if (this.removeEventListener) {
            this.removeEventListener();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: MetrikaGoalDirective, deps: [{ token: Metrika }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.3.33", type: MetrikaGoalDirective, isStandalone: true, selector: "[metrikaGoal]", inputs: { goalName: "goalName", eventName: "eventName", params: "params", counterId: "counterId", callback: "callback" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: MetrikaGoalDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[metrikaGoal]',
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: Metrika }, { type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { goalName: [{
                type: Input
            }], eventName: [{
                type: Input
            }], params: [{
                type: Input
            }], counterId: [{
                type: Input
            }], callback: [{
                type: Input
            }] } });

function defineDefaultId(counterConfigs, defaultCounter) {
    let configs;
    if (counterConfigs instanceof Array) {
        configs = counterConfigs;
    }
    else {
        configs = [counterConfigs];
    }
    let defaultId;
    if (!defaultCounter) {
        defaultId = configs[0].id;
    }
    else if (defaultCounter < configs.length) {
        defaultId = configs[defaultCounter].id;
    }
    else {
        defaultId = defaultCounter;
    }
    if (!defaultId) {
        console.warn('You provided wrong counter id as a default:', defaultCounter);
        return;
    }
    let defaultCounterExists = false;
    let config;
    for (let i = 0; i < configs.length; i++) {
        config = configs[i];
        if (!config.id) {
            console.warn('You should provide counter id to use Yandex metrika counter', config);
            continue;
        }
        if (config.id === defaultId) {
            defaultCounterExists = true;
        }
    }
    if (!defaultCounterExists) {
        console.warn('You provided wrong counter id as a default:', defaultCounter);
    }
    return defaultId;
}
function appInitializerFactory(counterConfigs, platformId, alternativeUrl) {
    if (isPlatformBrowser(platformId)) {
        return insertMetrika.bind(null, counterConfigs, alternativeUrl);
    }
    return () => 'none';
}
function insertMetrika(counterConfigs, alternativeUrl) {
    window.ym = window.ym || function () {
        (window.ym.a = window.ym.a || []).push(arguments);
    };
    window.ym.l = new Date().getTime();
    const lastScript = document.getElementsByTagName('script')[0];
    const metrikaScript = document.createElement('script');
    metrikaScript.type = 'text/javascript';
    metrikaScript.src = alternativeUrl ?? 'https://mc.yandex.ru/metrika/tag.js';
    metrikaScript.async = true;
    lastScript.parentNode.insertBefore(metrikaScript, lastScript);
    for (const { id, ...counterConfig } of counterConfigs) {
        window.ym(id, 'init', counterConfig);
    }
}

class MetrikaModule {
    static forRoot(configs, options = {}) {
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
                provideAppInitializer(() => appInitializerFactory(inject(YANDEX_COUNTERS_CONFIGS), inject(PLATFORM_ID), inject(ALTERNATIVE_URL))()),
                {
                    provide: Metrika,
                    useClass: Metrika,
                    deps: [Injector, PLATFORM_ID],
                },
            ],
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: MetrikaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.3.33", ngImport: i0, type: MetrikaModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: MetrikaModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.33", ngImport: i0, type: MetrikaModule, decorators: [{
            type: NgModule
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Metrika, MetrikaGoalDirective, MetrikaModule, appInitializerFactory, defineDefaultId };
//# sourceMappingURL=ng-yandex-metrika.mjs.map
