import { Swiftx } from './factory.mjs';
import { render } from './render.mjs';
import { State, Effect } from './state.mjs';
import { Show, ForEach } from './directives.mjs';

/** @type {import('./index.d.ts').SwiftxFactory} */
const SwiftxNamespace = /** @type {any} */ (Swiftx);

SwiftxNamespace.render = render;
SwiftxNamespace.State = State;
SwiftxNamespace.Effect = Effect;
SwiftxNamespace.Show = Show;
SwiftxNamespace.ForEach = ForEach;
SwiftxNamespace.Ref = () => ({ current: null });
SwiftxNamespace.whenReady = (cb) => queueMicrotask(cb);

// Attach aliases
SwiftxNamespace.useState = State;
SwiftxNamespace.useEffect = Effect;
SwiftxNamespace.useRef = SwiftxNamespace.Ref;

/**
 * The Swiftx Proxy allows for a declarative DSL: Swiftx.div(...)
 * It intercepts property access and returns a tag-specific factory.
 */
const SwiftxProxy = new Proxy(SwiftxNamespace, {
    get(target, prop) {
        if (typeof prop === 'string') {
            if (prop in target) return target[prop];
            return (...args) => target(prop, ...args);
        }
        return Reflect.get(target, prop);
    }
});

export const useState = State;
export const useEffect = Effect;
export const whenReady = SwiftxNamespace.whenReady;
export const useRef = SwiftxNamespace.Ref;

export { render, Show, ForEach };
export default SwiftxProxy;
