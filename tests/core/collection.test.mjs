import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { ForEach, useState } from '../../index.mjs';

test('can render arrays from map()', () => {
    const items = ['A', 'B', 'C'];
    const list = Swiftx('ul', {}, items.map((item) => Swiftx('li', {}, item)));

    const container = document.createElement('div');
    Swiftx.render(list, container);

    const nodes = container.querySelectorAll('li');
    assert.equal(nodes.length, 3);
    assert.equal(container.textContent, 'ABC');
});

test('ForEach updates only the changed keyed item', async () => {
    const items = useState([
        { id: 1, label: 'A' },
        { id: 2, label: 'B' }
    ]);

    const container = document.createElement('div');
    const list = Swiftx('ul', {}, ForEach(items, 'id', (item) => (
        Swiftx('li', {}, item.label)
    )));

    Swiftx.render(list, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    const firstRenderNodes = Array.from(container.querySelectorAll('li'));
    const firstNode = firstRenderNodes[0];
    const secondNode = firstRenderNodes[1];

    items.set([
        items.get()[0],
        { id: 2, label: 'B2' }
    ]);
    await new Promise((resolve) => queueMicrotask(resolve));

    const secondRenderNodes = Array.from(container.querySelectorAll('li'));
    assert.equal(secondRenderNodes.length, 2);
    assert.equal(secondRenderNodes[0], firstNode);
    assert.notEqual(secondRenderNodes[1], secondNode);
    assert.equal(secondRenderNodes[1].textContent, 'B2');
});
