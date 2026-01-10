import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { ForEach, Show, useEffect, useState } from '../../index.mjs';

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

test('form submit enables only when all ForEach inputs are filled', async () => {
    const users = useState([
        { id: 1, name: '' },
        { id: 2, name: '' }
    ]);
    const isDisabled = useState(true);

    useEffect(() => {
        const allFilled = users.get().every((user) => user.name.trim().length > 0);
        isDisabled.set(!allFilled);
    }, [users]);

    const Form = () => (
        Swiftx('form', {}, [
            Swiftx('div', {}, [
                ForEach(users, 'id', (user, index) => (
                    Swiftx('input', {
                        type: 'text',
                        value: user.name,
                        change: (event) => {
                            const next = users.get().map((item, i) => (
                                i === index ? { ...item, name: event.target.value } : item
                            ));
                            users.set(next);
                        }
                    })
                ))
            ]),
            Swiftx('button', { type: 'submit', disabled: isDisabled }, 'Submit')
        ])
    );

    const container = document.createElement('div');
    Swiftx.render(Form, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    let button = container.querySelector('button');
    assert.ok(button);
    assert.equal(button.disabled, true);

    let inputs = Array.from(container.querySelectorAll('input'));
    assert.equal(inputs.length, 2);

    inputs[0].value = 'Ada';
    inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));

    button = container.querySelector('button');
    assert.equal(button.disabled, true);

    inputs = Array.from(container.querySelectorAll('input'));
    inputs[1].value = 'Bob';
    inputs[1].dispatchEvent(new window.Event('change', { bubbles: true }));

    button = container.querySelector('button');
    assert.equal(button.disabled, false);

    inputs = Array.from(container.querySelectorAll('input'));
    inputs[0].value = '';
    inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));

    button = container.querySelector('button');
    assert.equal(button.disabled, true);
});

test('foreach delete buttons enable based on list size and entry value', async () => {
    const users = useState([
        { id: 1, name: '' },
        { id: 2, name: '' }
    ]);

    const Form = () => (
        Swiftx('form', {}, [
            Swiftx('div', {}, [
                ForEach(users, 'id', (user, index) => {
                    const deleteDisabled = user.name.trim().length === 0 || users.get().length <= 1;
                    return Swiftx('div', { class: 'row' }, [
                        Swiftx('input', {
                            type: 'text',
                            value: user.name,
                            change: (event) => {
                                const next = users.get().map((item, i) => (
                                    i === index ? { ...item, name: event.target.value } : item
                                ));
                                users.set(next);
                            }
                        }),
                        Swiftx('button', {
                            type: 'button',
                            disabled: deleteDisabled,
                            click: () => {
                                const next = users.get()
                                    .filter((_, i) => i !== index)
                                    .map((item) => ({ ...item }));
                                users.set(next);
                            }
                        }, 'Delete')
                    ]);
                })
            ])
        ])
    );

    const container = document.createElement('div');
    Swiftx.render(Form, container);
    await new Promise((resolve) => queueMicrotask(resolve));

    let inputs = Array.from(container.querySelectorAll('input'));
    let buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(inputs.length, 2);
    assert.equal(buttons.length, 2);
    assert.equal(buttons[0].disabled, true);
    assert.equal(buttons[1].disabled, true);

    inputs[0].value = 'Ada';
    inputs[0].dispatchEvent(new window.Event('change', { bubbles: true }));

    buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(buttons[0].disabled, false);
    assert.equal(buttons[1].disabled, true);

    inputs = Array.from(container.querySelectorAll('input'));
    inputs[1].value = 'Bob';
    inputs[1].dispatchEvent(new window.Event('change', { bubbles: true }));

    buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(buttons[0].disabled, false);
    assert.equal(buttons[1].disabled, false);

    buttons[0].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

    inputs = Array.from(container.querySelectorAll('input'));
    buttons = Array.from(container.querySelectorAll('button'));
    assert.equal(inputs.length, 1);
    assert.equal(buttons.length, 1);
    assert.equal(buttons[0].disabled, true);
});
