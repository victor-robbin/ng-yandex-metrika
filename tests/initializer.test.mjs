import '@angular/compiler';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  ApplicationInitStatus, createEnvironmentInjector, createNgModule,
  importProvidersFrom, Injector, NgModule, PLATFORM_ID, provideAppInitializer,
} from '@angular/core';
import { Metrika, MetrikaModule, appInitializerFactory, defineDefaultId } from '../dist/ng-yandex-metrika/fesm2022/ng-yandex-metrika.mjs';

// DOM заменён управляемой моделью: внешний скрипт и реальные события аналитики не отправляются.
function browser(existingYm) {
  const scripts = [];
  const anchor = { parentNode: { insertBefore(script, reference) {
    assert.equal(reference, anchor);
    scripts.push(script);
  } } };
  globalThis.window = existingYm ? { ym: existingYm } : {};
  globalThis.document = {
    getElementsByTagName(name) { assert.equal(name, 'script'); return [anchor]; },
    createElement(name) { assert.equal(name, 'script'); return {}; },
  };
  return scripts;
}
afterEach(() => { delete globalThis.window; delete globalThis.document; });

function consumer(kind, configs, options = {}, platform = 'browser', extras = []) {
  const providers = [ApplicationInitStatus, { provide: PLATFORM_ID, useValue: platform }, ...extras];
  if (kind === 'standalone') {
    const injector = createEnvironmentInjector([
      ...providers, importProvidersFrom(MetrikaModule.forRoot(configs, options)),
    ], Injector.NULL);
    return { injector, destroy: () => injector.destroy() };
  }
  class ConsumerModule {}
  NgModule({ imports: [MetrikaModule.forRoot(configs, options)], providers })(ConsumerModule);
  const module = createNgModule(ConsumerModule, Injector.NULL);
  return { injector: module.injector, destroy: () => module.destroy() };
}

for (const kind of ['standalone', 'NgModule']) {
  test(`${kind}: один счётчик запускается только при инициализации приложения`, async () => {
    const scripts = browser();
    const config = { id: 100, webvisor: true, clickmap: true };
    const c = consumer(kind, config);
    try {
      assert.equal(scripts.length, 0);
      assert.equal(window.ym, undefined);
      const status = c.injector.get(ApplicationInitStatus);
      status.runInitializers();
      assert.equal(status.done, true, 'загрузка внешнего скрипта не блокирует bootstrap');
      await status.donePromise;
      assert.deepEqual(scripts, [{ type: 'text/javascript', src: 'https://mc.yandex.ru/metrika/tag.js', async: true }]);
      assert.deepEqual(Array.from(window.ym.a[0]), [100, 'init', { webvisor: true, clickmap: true }]);
      assert.equal(typeof window.ym.l, 'number');
      assert.deepEqual(config, { id: 100, webvisor: true, clickmap: true });
      status.runInitializers();
      assert.equal(scripts.length, 1);
      assert.equal(window.ym.a.length, 1);
    } finally { c.destroy(); }
  });

  test(`${kind}: массив, alternativeUrl, выбор defaultCounter по индексу и ID`, () => {
    for (const defaultCounter of [1, 200]) {
      const calls = [];
      const ym = (...args) => calls.push(args);
      const scripts = browser(ym);
      const c = consumer(kind, [{ id: 100, clickmap: false }, { id: 200, webvisor: true }], {
        defaultCounter, alternativeUrl: 'https://analytics.example.test/tag.js',
      });
      try {
        c.injector.get(ApplicationInitStatus).runInitializers();
        assert.equal(window.ym, ym, 'существующий обработчик сохраняется');
        assert.equal(scripts[0].src, 'https://analytics.example.test/tag.js');
        assert.deepEqual(calls, [[100, 'init', { clickmap: false }], [200, 'init', { webvisor: true }]]);
        c.injector.get(Metrika).setUserID('user');
        c.injector.get(Metrika).setUserID('explicit', 100);
        assert.deepEqual(calls.slice(2), [[200, 'setUserID', 'user'], [100, 'setUserID', 'explicit']]);
      } finally { c.destroy(); }
    }
  });

  test(`${kind}: SSR не обращается к window/document`, async () => {
    for (const key of ['window', 'document']) {
      Object.defineProperty(globalThis, key, { configurable: true, get() { throw new Error(`SSR обращается к ${key}`); } });
    }
    const c = consumer(kind, [{ id: 100 }, { id: 200 }], { defaultCounter: 1 }, 'server');
    try {
      assert.ok(c.injector.get(Metrika));
      const status = c.injector.get(ApplicationInitStatus);
      status.runInitializers();
      await status.donePromise;
      assert.equal(status.done, true);
    } finally { c.destroy(); }
  });

  test(`${kind}: initializer сосуществует с другим асинхронным initializer`, async () => {
    const scripts = browser();
    let release;
    let calls = 0;
    const other = provideAppInitializer(() => { calls++; return new Promise(resolve => { release = resolve; }); });
    const c = consumer(kind, { id: 100 }, {}, 'browser', [other]);
    try {
      const status = c.injector.get(ApplicationInitStatus);
      status.runInitializers();
      assert.equal(scripts.length, 1);
      assert.equal(calls, 1);
      assert.equal(status.done, false);
      release();
      await status.donePromise;
      status.runInitializers();
      assert.equal(calls, 1);
      assert.equal(scripts.length, 1);
    } finally { c.destroy(); }
  });
}

test('Публичные factory и выбор счётчика сохраняют прежний контракт', () => {
  const scripts = browser();
  const init = appInitializerFactory([{ id: 100, clickmap: false }], 'browser');
  assert.equal(scripts.length, 0);
  init();
  assert.equal(scripts.length, 1);
  assert.deepEqual(Array.from(window.ym.a[0]), [100, 'init', { clickmap: false }]);
  assert.equal(appInitializerFactory([{ id: 100 }], 'server')(), 'none');
  assert.equal(defineDefaultId({ id: 100 }), 100);
  assert.equal(defineDefaultId([{ id: 100 }, { id: 200 }]), 100);
  assert.equal(defineDefaultId([{ id: 100 }, { id: 200 }], 1), 200);
  assert.equal(defineDefaultId([{ id: 100 }, { id: 200 }], 200), 200);
});

test('Сервис сохраняет callback, context и Promise после новой инициализации', async () => {
  const calls = [];
  browser((...args) => calls.push(args));
  const c = consumer('standalone', { id: 100 });
  try {
    c.injector.get(ApplicationInitStatus).runInitializers();
    const context = { label: 'контекст' };
    let callbackContext;
    const promise = c.injector.get(Metrika).reachGoal('goal', { value: 7 }, function () { callbackContext = this; }, context);
    assert.deepEqual(calls[1].slice(0, 4), [100, 'reachGoal', 'goal', { value: 7 }]);
    assert.equal(calls[1][5], context);
    calls[1][4].call(context);
    assert.equal(await promise, context);
    assert.equal(callbackContext, context);
  } finally { c.destroy(); }
});
