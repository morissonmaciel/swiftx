import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { Show, useState } from '../../index.mjs';

test('Swiftx.render mounts content into a container', () => {
    const container = document.createElement('div');
    Swiftx.render(Swiftx('div', { id: 'root' }, 'Hello'), container);
    assert.equal(container.querySelector('#root')?.textContent, 'Hello');
});

test('Show toggles content based on state', () => {
    const visible = useState(true);
    const container = document.createElement('div');

    const fragment = Show(visible, Swiftx('span', {}, 'On'));
    container.appendChild(fragment);
    assert.equal(container.textContent, 'On');

    visible.set(false);
    assert.equal(container.textContent, '');

    visible.set(true);
    assert.equal(container.textContent, 'On');
});

test('state can bind to inline styles', () => {
    const color = useState('rgb(0, 0, 0)');
    const container = document.createElement('div');

    Swiftx.render(
        Swiftx('div', { style: { color } }, 'Color'),
        container
    );

    const node = container.querySelector('div');
    assert.equal(node.style.color, 'rgb(0, 0, 0)');

    color.set('rgb(255, 0, 0)');
    assert.equal(node.style.color, 'rgb(255, 0, 0)');
});
