import assert from 'node:assert/strict';
import { test } from 'node:test';
import Swiftx, { Link } from '../../index.mjs';

test('Link updates the browser path on click', () => {
    const container = document.createElement('div');

    Swiftx.render(
        Swiftx(Link, { to: '/next' }, 'Next'),
        container
    );

    const anchor = container.querySelector('a');
    assert.ok(anchor);

    anchor.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    assert.equal(window.location.pathname, '/next');
});
