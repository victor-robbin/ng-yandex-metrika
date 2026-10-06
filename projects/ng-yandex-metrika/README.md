# ng-yandex-metrika

Интеграция Яндекс.Метрики с Angular 22. Форк сохраняет API `MetrikaModule`, `Metrika` и `MetrikaGoalDirective`.

## Совместимость

Релиз **22.0.1** собран и проверен с **Angular 22.2.1**, последней стабильной версией на 06.10.2026. Angular-зависимости приложения должны находиться в линии **22.x**. Пакет поставляется в Angular Package Format: ESM, декларации TypeScript, partial compilation. Публичная точка входа также экспортирует типы API Метрики (`HitOptions`, `VisitParameters` и другие).

Для сборки исходников используются Node **22.23.3**, npm **11.12.0** и TypeScript **6.0.3**. Требования Angular к среде: [официальная таблица совместимости](https://angular.dev/reference/versions).

## Установка

```bash
npm install 'git+https://github.com/victor-robbin/ng-yandex-metrika.git#v22.0.1'
```

Тег указывает на готовый пакет в корне репозитория. При установке не требуется собирать библиотеку или иметь её исходники рядом с приложением. `package-lock.json` фиксирует коммит тега; `npm ci` воспроизводит установку. Архив `ng-yandex-metrika-22.0.1.tgz` из GitHub Releases также можно установить через `npm install ./ng-yandex-metrika-22.0.1.tgz`.

Имя пакета и импорты остаются `ng-yandex-metrika`. Публикация этой версии в npm registry не выполняется: для данного форка используйте GitHub-тег или архив релиза.

## Подключение

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MetrikaModule } from 'ng-yandex-metrika';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      MetrikaModule.forRoot({ id: 35567075, webvisor: true }),
    ),
  ],
};
```

Для приложения с NgModule добавьте `MetrikaModule.forRoot(...)` в `imports`. Можно передать массив настроек счётчиков и второй аргумент с `defaultCounter` и `alternativeUrl`. Инициализатор использует `provideAppInitializer()` и `inject()`, загружает скрипт Метрики только в браузере и не блокирует запуск приложения ожиданием внешнего сервиса. При SSR initializer не обращается к `window` или `document`. Методы сервиса, отправляющие события через `window.ym`, по-прежнему следует вызывать только в браузере; это не универсальная SSR-защита всего сервиса. Подключайте `forRoot` один раз на уровне приложения, а не в ленивых модулях.

```typescript
import { inject } from '@angular/core';
import { Metrika } from 'ng-yandex-metrika';

export class PageComponent {
  private readonly metrika = inject(Metrika);

  onClick(): void {
    void this.metrika.reachGoal('button_click');
  }
}
```

Для директивы добавьте `MetrikaGoalDirective` в `imports` компонента:

```html
<button metrikaGoal goalName="button_click">Нажать</button>
```

Метод `hit` отправляет просмотры страниц; автоматическую подписку на навигацию организует приложение. Для методов с callback сервис возвращает Promise. Полный список методов: [API Яндекс.Метрики](https://yandex.ru/support/metrica/ru/objects/method-reference).

## Разработка и релиз

Исходники находятся в ветке `master`, готовые пакеты — в `package-angular-22`. Релизные теги `v22.x.y` указывают на готовые пакеты, а не на workspace.

```bash
nvm use
npm ci
npm test
npm run pack:release
```

Для нового релиза измените версии в обоих `package.json`, выполните сборку и проверку установки архива в Angular-приложение. Содержимое `dist/ng-yandex-metrika` перенесите в ветку готовых пакетов, создайте неизменяемый тег и GitHub Release с архивом от `npm pack`. Публикация тега запускает GitHub Actions: проверку пакета, создание GitHub Release, загрузку архива и SHA256SUMS. Файл `.github/workflows/release.yml` и `RELEASE_NOTES.md` должны присутствовать в ветке готовых пакетов. Старые теги не перемещайте. README и лицензия включаются в пакет через настройки ng-packagr.

## Проверки версии 22.0.1

- `npm test`: production-сборка, 10 регрессионных тестов и AOT-компиляция тестовых NgModule/standalone потребителей на Angular 22.2.1.
- Проверяются однократный запуск, массив счётчиков, настройки, alternativeUrl, defaultCounter по индексу/ID, сохранение существующего ym и callback/Promise/context, совместная работа initializer и SSR без доступа к DOM.
- Тесты используют настоящий Angular DI/ApplicationInitStatus и управляемую модель DOM; внешний скрипт и реальные события аналитики не отправляются.
- Публичные декларации TypeScript сохранены относительно 22.0.0; `appInitializerFactory` остаётся доступной. CI запускает эти проверки перед упаковкой.
- Пакет предназначен для установки по Git-тегу и чистой установки `npm ci` без `--force` и `--legacy-peer-deps`.

## Лицензия

MIT. Автор исходной библиотеки — Lyubimov Roman.
