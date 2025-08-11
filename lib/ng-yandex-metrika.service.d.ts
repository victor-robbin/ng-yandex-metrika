import { Injector } from '@angular/core';
import { ExtLinkOptions, FileOptions, HitOptions, NotBounceOptions, UserParameters, VisitParameters } from './yandex-mterika-tag';
import * as i0 from "@angular/core";
export declare class Metrika {
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
