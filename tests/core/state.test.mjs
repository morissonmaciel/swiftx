import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { useState, useEffect } from '../../index.mjs';

test('useState get/set/subscribe works', () => {
    const state = useState(0);
    let seen = null;
    const unsubscribe = state.subscribe((v) => { seen = v; });

    state.set(3);
    assert.equal(state.get(), 3);
    assert.equal(seen, 3);

    unsubscribe();
    state.set(4);
    assert.equal(seen, 3);
});

test('useState map creates a derived state', () => {
    const state = useState(2);
    const derived = state.map((v) => v * 2);

    assert.equal(derived.get(), 4);
    state.set(3);
    assert.equal(derived.get(), 6);
});

test('useEffect runs immediately and on dependency change', () => {
    const state = useState(1);
    const seen = [];

    useEffect((v) => {
        seen.push(v);
    }, [state]);

    state.set(2);
    state.set(3);

    assert.deepEqual(seen, [1, 2, 3]);
});

test('factory marks function props as events for elements', () => {
    const onClick = () => {};
    const vnode = Swiftx('button', { click: onClick, title: 'x' }, 'OK');

    assert.equal(vnode.events.click, onClick);
    assert.equal(vnode.props.title, 'x');
});

test('factory passes function props through for components', () => {
    const onClick = () => {};
    const Comp = () => 'ok';
    const vnode = Swiftx(Comp, { click: onClick });

    assert.equal(vnode.props.click, onClick);
    assert.equal(vnode.events.click, undefined);
});
