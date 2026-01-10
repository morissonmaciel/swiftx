import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { useMemo, useState } from '../../index.mjs';

test('useMemo computes a derived readonly state', () => {
    const first = useState('Ada');
    const last = useState('Lovelace');
    const fullName = useMemo([first, last], (a, b) => `${a} ${b}`);

    assert.equal(fullName.get(), 'Ada Lovelace');
    assert.equal('set' in fullName, false);

    let seen;
    const unsubscribe = fullName.subscribe((value) => { seen = value; });
    first.set('Grace');
    assert.equal(fullName.get(), 'Grace Lovelace');
    assert.equal(seen, 'Grace Lovelace');
    unsubscribe();
});

test('Swiftx.Compute derives DOM-bound values', () => {
    const first = useState('Ada');
    const last = useState('Lovelace');
    const fullName = Swiftx.Compute([first, last], (a, b) => `${a} ${b}`);

    const View = () => (
        Swiftx('div', {}, [
            Swiftx('p', { id: 'name' }, ['Name: ', fullName])
        ])
    );

    const container = document.createElement('div');
    Swiftx.render(View, container);

    const nameNode = container.querySelector('#name');
    assert.equal(nameNode?.textContent, 'Name: Ada Lovelace');

    first.set('Grace');
    assert.equal(nameNode?.textContent, 'Name: Grace Lovelace');
});
