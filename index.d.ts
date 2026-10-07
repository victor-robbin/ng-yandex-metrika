import * as i0 from '@angular/core';
import { Injector, AfterViewInit, OnDestroy, Renderer2, ElementRef, ModuleWithProviders } from '@angular/core';

declare global {
    interface Window {
        ym: YandexEvent;
    }
}
interface YandexEvent {
    (counterId: number, eventName: "init", parameters: InitParameters): void;
    (counterId: number, eventName: "addFileExtension", extensions: string | string[]): void;
    <CTX>(counterId: number, eventName: "extLink", url: string, options?: ExtLinkOptions<CTX>): void;
    <CTX>(counterId: number, eventName: "file", url: string, options?: FileOptions<CTX>): void;
    (counterId: number, eventName: "getClientID", cb: (clientID: string) => void): void;
    <CTX>(counterId: number, eventName: "hit", url: string, options?: HitOptions<CTX>): void;
    /** @deprecated */
    (counterId: number, eventName: "hit", url: string, title?: string, referer?: string, params?: VisitParameters): void;
    <CTX>(counterId: number, eventName: "notBounce", options?: NotBounceOptions<CTX>): void;
    (counterId: number, eventName: "params", parameters: VisitParameters | VisitParameters[]): void;
    <CTX>(counterId: number, eventName: "reachGoal", target: string, params?: VisitParameters, callback?: (this: CTX) => void, ctx?: CTX): void;
    (counterId: number, eventName: "replacePhones"): void;
    (counterId: number, eventName: "setUserID", userID: string): void;
    (counterId: number, eventName: "userParams", parameters: UserParameters): void;
    l: number;
    a: unknown[];
}
interface VisitParameters {
    order_price?: number | undefined;
    currency?: string | undefined;
    [key: string]: any;
}
interface UserParameters {
    UserID?: number | undefined;
    [key: string]: any;
}
interface InitParameters {
    accurateTrackBounce?: boolean | number | undefined;
    childIframe?: boolean | undefined;
    clickmap?: boolean | undefined;
    defer?: boolean | undefined;
    ecommerce?: boolean | string | any[] | undefined;
    params?: VisitParameters | VisitParameters[] | undefined;
    userParams?: UserParameters | undefined;
    trackHash?: boolean | undefined;
    trackLinks?: boolean | undefined;
    trustedDomains?: string[] | undefined;
    type?: number | undefined;
    ut?: "noindex" | undefined;
    webvisor?: boolean | undefined;
    triggerEvent?: boolean | undefined;
}
interface CallbackOptions<CTX> {
    callback?: (this: CTX) => void;
    ctx?: CTX | undefined;
}
interface ExtLinkOptions<CTX> extends CallbackOptions<CTX> {
    params?: VisitParameters | undefined;
    title?: string | undefined;
}
interface FileOptions<CTX> extends CallbackOptions<CTX> {
    params?: VisitParameters | undefined;
    referer?: string | undefined;
    title?: string | undefined;
}
interface HitOptions<CTX> extends CallbackOptions<CTX> {
    params?: VisitParameters | undefined;
    referer?: string | undefined;
    title?: string | undefined;
}
interface NotBounceOptions<CTX> extends CallbackOptions<CTX> {
}

declare class Metrika {
    private defaultCounterId;
    private counterConfigs;
    constructor(injector: Injector);
    addFileExtension(extensions: string | string[], counterId?: number): void;
    extLink<CTX>(url: string, options?: ExtLinkOptions<CTX>, counterId?: number): Promise<unknown>;
    file<CTX>(url: string, options?: FileOptions<CTX>, counterId?: number): Promise<unknown>;
    getClientID(counterId?: number): Promise<unknown>;
    setUserID(userId: string, counterId?: number): void;
    userParams(parameters: UserParameters, counterId?: number): void;
    params(parameters: VisitParameters | VisitParameters[], counterId?: number): void;
    replacePhones(counterId?: number): void;
    notBounce<CTX>(options: NotBounceOptions<CTX>, counterId?: number): Promise<unknown>;
    fireEvent: <CTX>(target: string, params?: VisitParameters | undefined, callback?: (this: CTX) => void, ctx?: CTX | undefined, counterId?: number) => Promise<unknown>;
    reachGoal<CTX>(target: string, params?: VisitParameters | undefined, callback?: (this: CTX) => void, ctx?: CTX | undefined, counterId?: number): Promise<unknown>;
    hit<CTX>(url: string, options?: HitOptions<CTX>, counterId?: number): Promise<unknown>;
    private getCallbackPromise;
    static ɵfac: i0.ɵɵFactoryDeclaration<Metrika, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Metrika>;
}

declare class MetrikaGoalDirective implements AfterViewInit, OnDestroy {
    private metrika;
    private renderer;
    private el;
    goalName: string;
    eventName: string;
    params: Record<string, any>;
    counterId?: number;
    callback: () => void;
    private removeEventListener;
    constructor(metrika: Metrika, renderer: Renderer2, el: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MetrikaGoalDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MetrikaGoalDirective, "[metrikaGoal]", never, { "goalName": { "alias": "goalName"; "required": false; }; "eventName": { "alias": "eventName"; "required": false; }; "params": { "alias": "params"; "required": false; }; "counterId": { "alias": "counterId"; "required": false; }; "callback": { "alias": "callback"; "required": false; }; }, {}, never, never, true, never>;
}

interface CounterConfig extends InitParameters {
    id: number;
}

declare function defineDefaultId(counterConfigs: CounterConfig | CounterConfig[], defaultCounter?: number): number | undefined;
declare function appInitializerFactory(counterConfigs: CounterConfig[], platformId: Object, alternativeUrl?: string): () => void;

type Options = {
    defaultCounter?: number;
    alternativeUrl?: string;
};
declare class MetrikaModule {
    static forRoot(configs: CounterConfig | CounterConfig[], options?: Options): ModuleWithProviders<MetrikaModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MetrikaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MetrikaModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MetrikaModule>;
}

export { Metrika, MetrikaGoalDirective, MetrikaModule, appInitializerFactory, defineDefaultId };
export type { CallbackOptions, ExtLinkOptions, FileOptions, HitOptions, InitParameters, NotBounceOptions, UserParameters, VisitParameters, YandexEvent };
