# ng-yandex-metrika 22.0.1

Patch-релиз для Angular **22.x**, собран на **22.2.1**.

- Устаревшая регистрация APP_INITIALIZER заменена на provideAppInitializer() с inject().
- API forRoot, appInitializerFactory, сервис, директива и публичные декларации TypeScript сохранены относительно 22.0.0.
- Initializer загружает скрипт только в браузере, не блокируя запуск приложения ожиданием внешнего сервиса. SSR не обращается к window/document. Методы сервиса отправки событий следует вызывать только в браузере.
- Проверены 10 сценариев на настоящем Angular DI/ApplicationInitStatus: NgModule/standalone, один/несколько счётчиков, alternativeUrl, defaultCounter, сохранение ym, однократный запуск, совместная работа initializer, SSR, callback/context/Promise.
- Прошли AOT-компиляция обоих видов потребителя, чистая установка архива, повторные 10 проверок установленного пакета и проверка дерева зависимостей; npm audit независимого потребителя — 0.
- README и CI обновлены; архив включает ESM, типы, README и MIT-лицензию.

## Установка

```bash
npm install 'git+https://github.com/victor-robbin/ng-yandex-metrika.git#v22.0.1'
```

Тег указывает на готовый пакет. При установке не требуется собирать workspace или иметь исходники рядом с приложением. В npm registry этот fork не публикуется. Архив npm pack и SHA256SUMS прикрепляются workflow выпуска.

[Исходники сборки](https://github.com/victor-robbin/ng-yandex-metrika/commit/20c242270a471579b15d65af6d03edb5bd482c5a) (ветка master).
