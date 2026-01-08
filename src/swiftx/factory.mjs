/**
 * VDOM Element Factory
 */
export const Swiftx = function (tag, propsOrChildren, ...restChildren) {
    const el = { tag, props: {}, events: {}, children: [] }
    let p = propsOrChildren, c = restChildren

    if (arguments.length === 2 && (Array.isArray(p) || typeof p === 'string' || p?.tag || p?.subscribe || p instanceof Node)) {
        c = Array.isArray(p) ? p : [p]
        p = {}
    }

    if (p && typeof p === 'object') {
        const isComponent = typeof tag === 'function';
        for (const [k, v] of Object.entries(p)) {
            // Components get all props. Elements treat functions as events.
            if (!isComponent && typeof v === 'function') {
                el.events[k] = v;
            } else {
                el.props[k] = v;
            }
        }
    }
    if (c && c.length) {
        const normalized = []
        for (const child of c) {
            if (Array.isArray(child)) {
                normalized.push(...child)
            } else if (child !== undefined && child !== null) {
                normalized.push(child)
            }
        }
        el.children = normalized
    }
    return el
}
