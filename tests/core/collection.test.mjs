import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx from '../../index.mjs';

test('can render arrays from map()', () => {
    const items = ['A', 'B', 'C'];
    const list = Swiftx('ul', {}, items.map((item) => Swiftx('li', {}, item)));

    const container = document.createElement('div');
    Swiftx.render(list, container);

    const nodes = container.querySelectorAll('li');
    assert.equal(nodes.length, 3);
    assert.equal(container.textContent, 'ABC');
});
