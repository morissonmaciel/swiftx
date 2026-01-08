import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { BrowserRouter, RouterStack, Route } from '../../index.mjs';

test('Route builder creates a rule with render', () => {
    const rule = Route.on('/').render(() => 'ok');
    assert.equal(rule.condition, '/');
    assert.equal(typeof rule.render, 'function');
});

test('Route notFound can be defined', () => {
    const rule = Route.notFound.render(() => 'nf');
    assert.equal(rule.condition, Route._NOT_FOUND);
    assert.equal(typeof rule.render, 'function');
});

test('RouterStack renders the matched route', () => {
    const container = document.createElement('div');
    const App = () => Swiftx(RouterStack, {
        rootPath: '/',
        rules: [
            Route.on('/').render(() => Swiftx('div', {}, 'Home')),
            Route.notFound.render(() => Swiftx('div', {}, 'NF'))
        ]
    });

    Swiftx.render(
        Swiftx(BrowserRouter, {}, Swiftx(App)),
        container
    );

    assert.equal(container.textContent, 'Home');
});
