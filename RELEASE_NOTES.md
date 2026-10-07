# ng-yandex-metrika 20.0.0 — Angular 20

Совместимая линия собственного форка для Angular 20.x. Собрана на Angular 20.3.33, CLI/build 20.3.39, ng-packagr 20.3.2 и TypeScript 5.8.3.

- Сохранены MetrikaModule.forRoot, Metrika, MetrikaGoalDirective и публичные типы.
- provideAppInitializer обеспечивает однократную инициализацию, неблокирующую загрузку скрипта и SSR без обращения к DOM.
- Прошли library build, 10 тестов DI/initializer/SSR/callback/Promise и AOT-компиляция standalone/NgModule потребителей.
- Архив включает ESM, index.d.ts, README и MIT-лицензию. Peer dependencies допускают Angular 20; старые релизы 19/21/22 сохранены.

Установка: npm install 'git+https://github.com/victor-robbin/ng-yandex-metrika.git#v20.0.0'

Исходники: https://github.com/victor-robbin/ng-yandex-metrika/commit/cee6e5a (ветка codex/angular-20-support).
Тег указывает на готовый пакет; соседние checkout и npm link не требуются. Эта совместимая линия не заменяет latest-релиз Angular 22.
