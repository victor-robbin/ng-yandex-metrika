import { AfterViewInit, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { Metrika } from './ng-yandex-metrika.service';
import * as i0 from "@angular/core";
export declare class MetrikaGoalDirective implements AfterViewInit, OnDestroy {
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
