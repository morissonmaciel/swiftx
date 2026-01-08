import { BrowserRouter, _routeState } from './browser-router.mjs';
import { RouterStack } from './router-stack.mjs';
import { Route } from './route.mjs';
import { Link } from './link.mjs';

// Public API Exports
export { BrowserRouter, RouterStack, Route, Link };

export const SwiftxRouter = {
    BrowserRouter,
    RouterStack,
    Route,
    Link
};

const SwiftxRouterProxy = new Proxy(SwiftxRouter, {
    get(target, prop) {
        if (prop in target) return target[prop];
        if (typeof prop === 'string') {
            const aliases = {
                browserRouter: 'BrowserRouter',
                routerStack: 'RouterStack',
                route: 'Route',
                link: 'Link'
            };
            if (aliases[prop]) return target[aliases[prop]];
        }
        return Reflect.get(target, prop);
    }
});

export { SwiftxRouterProxy as Router };

export default SwiftxRouterProxy;
