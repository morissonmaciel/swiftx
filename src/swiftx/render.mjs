import { swiftxToDOM } from './dom.mjs';

/**
 * Root render function
 */
export function render(component, container) {
    const vdom = typeof component === 'function' ? component() : component
    container.appendChild(swiftxToDOM(vdom))
}
