# ng-yandex-metrika — Angular 20

Совместимая сборка пользовательского форка для Angular 20. Исходная библиотека: FriOne/ng-yandex-metrika (MIT, Lyubimov Roman); исходный commit форка: 20c242270a471579b15d65af6d03edb5bd482c5a.

Версия пакета: 20.0.0. Angular peer dependencies: ^20.0.0. Пакет собран с Angular 20.3.33, CLI/build 20.3.39, ng-packagr 20.3.2, TypeScript 5.8.3 и Node 22.22.1.

Сохранены MetrikaModule.forRoot, Metrika, MetrikaGoalDirective и типы API. Инициализация использует provideAppInitializer, запускается однократно, не блокирует bootstrap ожиданием внешнего скрипта и не обращается к DOM при SSR.

Проверки: production library build, 10 содержательных тестов Angular DI/initializer/SSR/callback/Promise и AOT-компиляция standalone/NgModule потребителей. Тесты заменяют DOM управляемой моделью и не отправляют реальные события аналитики.

Подключение:

```typescript
import { importProvidersFrom } from '@angular/core';
import { MetrikaModule } from 'ng-yandex-metrika';

const providers = [importProvidersFrom(MetrikaModule.forRoot({ id: 100 }))];
```

Лицензия MIT; исходное авторство сохранено. Этот пакет поддерживает только Angular 20, не Angular 21/22.

## Установка опубликованного пакета

```sh
npm install 'git+https://github.com/victor-robbin/ng-yandex-metrika.git#v20.0.0'
```

Исходники этой линии находятся в ветке `codex/angular-20-support`; готовый пакет — `codex/package-angular-20`. Проверки исходников: `npm ci && npm test`. Создание архива: `npm run pack:release`. Релизы Angular 19/21/22 сохраняются отдельно.
