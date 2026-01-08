import { swiftxToDOM } from './dom.mjs';

/**
 * Conditional rendering
 */
export function Show(state, vdom) {
    const anchor = document.createComment('swiftx-show')
    let el = null

    const update = (visible) => {
        if (visible) {
            if (el) el.remove();
            const content = typeof vdom === 'function' ? vdom() : vdom;
            el = swiftxToDOM(content)
            anchor.parentNode?.insertBefore(el, anchor)
        } else if (!visible && el) {
            el.remove(); el = null
        }
    }

    state.subscribe(update)

    const frag = document.createDocumentFragment()
    if (state.get()) {
        const content = typeof vdom === 'function' ? vdom() : vdom;
        el = swiftxToDOM(content)
        frag.append(el)
    }
    frag.append(anchor)
    return frag
}

/**
 * Keyed list rendering with minimal diffing.
 */
export function ForEach(itemsState, keyOrOptions, render) {
    const anchor = document.createComment('swiftx-foreach');
    const keyPath = typeof keyOrOptions === 'string'
        ? keyOrOptions
        : keyOrOptions?.key;

    const getItems = () => {
        if (itemsState && typeof itemsState.get === 'function') return itemsState.get() || [];
        return Array.isArray(itemsState) ? itemsState : [];
    };

    const entries = new Map();

    const warnMissingKey = (index) => {
        console.warn(`Swiftx.ForEach: missing key for item at index ${index}, falling back to index.`);
    };

    const resolveKey = (item, index) => {
        if (!keyPath) return index;
        const key = item?.[keyPath];
        if (key === undefined || key === null) {
            warnMissingKey(index);
            return index;
        }
        return key;
    };

    const moveRange = (entry, beforeNode) => {
        const parent = beforeNode.parentNode;
        if (!parent) return;
        const nodes = [];
        let node = entry.start;
        while (node) {
            nodes.push(node);
            if (node === entry.end) break;
            node = node.nextSibling;
        }
        for (const n of nodes) {
            parent.insertBefore(n, beforeNode);
        }
    };

    const createEntry = (item, index, key) => {
        const start = document.createComment('swiftx-foreach:start');
        const end = document.createComment('swiftx-foreach:end');
        const content = typeof render === 'function' ? render(item, index) : render;
        const dom = swiftxToDOM(content);
        return { key, item, start, end, dom };
    };

    const insertEntry = (entry, beforeNode) => {
        const parent = beforeNode.parentNode;
        if (!parent) return;
        parent.insertBefore(entry.start, beforeNode);
        parent.insertBefore(entry.dom, beforeNode);
        parent.insertBefore(entry.end, beforeNode);
    };

    const removeEntry = (entry) => {
        let node = entry.start;
        while (node) {
            const next = node.nextSibling;
            node.remove();
            if (node === entry.end) break;
            node = next;
        }
    };

    const update = () => {
        const items = getItems();
        const nextKeys = new Set();

        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const key = resolveKey(item, index);
            if (nextKeys.has(key)) {
                console.warn(`Swiftx.ForEach: duplicate key "${String(key)}" at index ${index}, falling back to index.`);
            }
            const entryKey = nextKeys.has(key) ? index : key;
            nextKeys.add(entryKey);

            let entry = entries.get(entryKey);
            if (!entry) {
                entry = createEntry(item, index, entryKey);
                entries.set(entryKey, entry);
                insertEntry(entry, anchor);
            } else {
                if (entry.item !== item) {
                    const content = typeof render === 'function' ? render(item, index) : render;
                    const nextDom = swiftxToDOM(content);
                    entry.dom.replaceWith(nextDom);
                    entry.dom = nextDom;
                    entry.item = item;
                }
                moveRange(entry, anchor);
            }
        }

        for (const [key, entry] of entries) {
            if (!nextKeys.has(key)) {
                removeEntry(entry);
                entries.delete(key);
            }
        }
    };

    const state = itemsState && typeof itemsState.subscribe === 'function' ? itemsState : null;
    if (state) state.subscribe(update);

    const frag = document.createDocumentFragment();
    frag.append(anchor);
    queueMicrotask(update);
    return frag;
}
