import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Input, Directive, PLATFORM_ID, APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const DEFAULT_COUNTER_ID = new InjectionToken('DEFAULT_COUNTER_ID');
const YANDEX_COUNTERS_CONFIGS = new InjectionToken('YANDEX_COUNTERS_CONFIGS');
const ALTERNATIVE_URL = new InjectionToken('ALTERNATIVE_URL');

class Metrika {
    defaultCounterId;
    counterConfigs;
    constructor(injector) {
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
    fireEvent = this.reachGoal;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: Metrika, deps: [{ token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: Metrika, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: Metrika, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i0.Injector }] });

class MetrikaGoalDirective {
    metrika;
    renderer;
    el;
    goalName;
    eventName = 'click';
    params;
    counterId;
    callback;
    removeEventListener;
    constructor(metrika, renderer, el) {
        this.metrika = metrika;
        this.renderer = renderer;
        this.el = el;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: MetrikaGoalDirective, deps: [{ token: Metrika }, { token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.14", type: MetrikaGoalDirective, isStandalone: true, selector: "[metrikaGoal]", inputs: { goalName: "goalName", eventName: "eventName", params: "params", counterId: "counterId", callback: "callback" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: MetrikaGoalDirective, decorators: [{
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

/** Picks the default counter ID from provided configs (with optional explicit index/id) */
function defineDefaultId(counterConfigs, defaultCounter) {
    const configs = Array.isArray(counterConfigs) ? counterConfigs : [counterConfigs];
    let defaultId;
    if (!defaultCounter && defaultCounter !== 0) {
        defaultId = configs[0]?.id;
    }
    else if (defaultCounter < configs.length) {
        defaultId = configs[defaultCounter]?.id;
    }
    else {
        // treat defaultCounter as a raw id
        defaultId = defaultCounter;
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
        if (cfg.id === defaultId)
            exists = true;
    }
    if (!exists) {
        console.warn('You provided wrong counter id as a default:', defaultCounter);
    }
    return defaultId;
}
/** Angular APP_INITIALIZER factory: on browser inserts Metrika, on SSR no-op */
function appInitializerFactory(counterConfigs, platformId, alternativeUrl) {
    if (isPlatformBrowser(platformId)) {
        return insertMetrika.bind(null, counterConfigs, alternativeUrl);
    }
    // SSR path: return a no-op initializer
    return () => { };
}
/** Ensure window.ym exists with the required shape */
function ensureYm() {
    const anyWin = window;
    if (typeof anyWin.ym === 'function' && 'l' in anyWin.ym) {
        return anyWin.ym;
    }
    const ymShim = ((...args) => {
        (ymShim.a = ymShim.a || []).push(args);
    });
    ymShim.a = [];
    ymShim.l = Date.now();
    anyWin.ym = ymShim;
    return ymShim;
}
/** Inject tag.js and init all provided counters */
function insertMetrika(counterConfigs, alternativeUrl) {
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
        if (id)
            ym(id, 'init', cfg);
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
                {
                    provide: APP_INITIALIZER,
                    useFactory: appInitializerFactory,
                    deps: [YANDEX_COUNTERS_CONFIGS, PLATFORM_ID, ALTERNATIVE_URL],
                    multi: true,
                },
                {
                    provide: Metrika,
                    useClass: Metrika,
                    deps: [Injector, PLATFORM_ID],
                },
            ],
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: MetrikaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.14", ngImport: i0, type: MetrikaModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: MetrikaModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.14", ngImport: i0, type: MetrikaModule, decorators: [{
            type: NgModule
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { Metrika, MetrikaGoalDirective, MetrikaModule, appInitializerFactory, defineDefaultId };
//# sourceMappingURL=ng-yandex-metrika.mjs.map
