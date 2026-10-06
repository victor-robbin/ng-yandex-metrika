import { ApplicationConfig, Component, importProvidersFrom, NgModule } from '@angular/core';
import { MetrikaModule, MetrikaGoalDirective, HitOptions, VisitParameters } from 'ng-yandex-metrika';

@Component({ selector: 'test-root', template: '<button metrikaGoal goalName="test">Тест</button>', imports: [MetrikaGoalDirective] })
export class ConsumerComponent {}

@NgModule({ imports: [ConsumerComponent, MetrikaModule.forRoot([{ id: 100 }, { id: 200 }], { defaultCounter: 1 })] })
export class ConsumerModule {}

export const appConfig: ApplicationConfig = {
  providers: [importProvidersFrom(MetrikaModule.forRoot({ id: 100 }, { alternativeUrl: 'https://example.test/tag.js' }))],
};
export const hitOptions: HitOptions<unknown> = {};
export const parameters: VisitParameters = { example: true };
