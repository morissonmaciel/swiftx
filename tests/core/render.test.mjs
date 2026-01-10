import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { useEffect, useState } from '../../index.mjs';

test('Swiftx.render mounts content into a container', () => {
    const container = document.createElement('div');
    Swiftx.render(Swiftx('div', { id: 'root' }, 'Hello'), container);
    assert.equal(container.querySelector('#root')?.textContent, 'Hello');
});

test('Swiftx renders SVG elements with the proper namespace', () => {
    const container = document.createElement('div');
    const view = Swiftx('svg', { width: '10', height: '10' }, [
        Swiftx('circle', { cx: '5', cy: '5', r: '4', fill: 'currentColor' })
    ]);

    Swiftx.render(view, container);

    const svg = container.querySelector('svg');
    const circle = container.querySelector('circle');
    assert.ok(svg);
    assert.ok(circle);
    assert.equal(svg.namespaceURI, 'http://www.w3.org/2000/svg');
    assert.equal(circle.namespaceURI, 'http://www.w3.org/2000/svg');
});

test('Swiftx renders HTML elements without the SVG namespace', () => {
    const container = document.createElement('div');
    Swiftx.render(Swiftx('div', { id: 'box' }, 'Hi'), container);

    const div = container.querySelector('div');
    assert.ok(div);
    assert.equal(div.namespaceURI, 'http://www.w3.org/1999/xhtml');
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

test('form input toggles submit disabled state via effect', () => {
    const text = useState('');
    const isDisabled = useState(true);

    useEffect((value) => {
        isDisabled.set(!value);
    }, [text]);

    const Form = () => (
        Swiftx('form', {}, [
            Swiftx('input', {
                type: 'text',
                change: (event) => text.set(event.target.value)
            }),
            Swiftx('button', { type: 'submit', disabled: isDisabled }, 'Submit')
        ])
    );

    const container = document.createElement('div');
    Swiftx.render(Form, container);

    const input = container.querySelector('input');
    const button = container.querySelector('button');
    assert.ok(input);
    assert.ok(button);
    assert.equal(button.disabled, true);

    input.value = 'hello';
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(button.disabled, false);

    input.value = '';
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
    assert.equal(button.disabled, true);
});
