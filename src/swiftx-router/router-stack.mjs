import Swiftx from '../swiftx/index.mjs';
import { _routeState, incrementRouterCount, navigate, back } from './browser-router.mjs';
import { Route } from './route.mjs';

/**
 * Internal utility to match a path against a pattern (e.g., /user/:id).
 * 
 * @param {string} pattern - The route pattern to match against.
 * @param {string} path - The actual URL path.
 * @returns {Object} An object containing:
 *   - matches {boolean}: Whether the path matches the pattern.
 *   - params {Object}: Extracted dynamic parameters from colon-prefixed segments.
 */
const matchPath = (pattern, path) => {
    if (pattern === Route._NOT_FOUND) return { matches: false, params: {} };

    const patternSegments = pattern.split('/').filter(Boolean);
    const pathSegments = path.split('/').filter(Boolean);

    if (patternSegments.length !== pathSegments.length) {
        return { matches: false, params: {} };
    }

    const params = {};
    const matches = patternSegments.every((seg, i) => {
        if (seg.startsWith(':')) {
            const paramName = seg.slice(1);
            params[paramName] = pathSegments[i];
            return true;
        }
        return seg === pathSegments[i];
    });

    return { matches, params };
};

/**
 * RouterStack Component.
 * 
 * @param {import('./index.d.ts').RouterStackProps|string} propsOrRoot - Props object or rootPath.
 * @param {Array} [rulesArg=[]] - Route rules when using positional args.
 * @param {Function|null} [layoutArg=null] - Layout component when using positional args.
 */
export const RouterStack = (propsOrRoot, rulesArg = [], layoutArg = null) => {
    const isPropsObject = typeof propsOrRoot === 'object' && propsOrRoot !== null && !Array.isArray(propsOrRoot);
    const rootPath = isPropsObject ? propsOrRoot.rootPath : propsOrRoot;
    const rules = isPropsObject ? (propsOrRoot.rules || []) : rulesArg;
    const layout = isPropsObject ? (propsOrRoot.layout || null) : layoutArg;

    incrementRouterCount();

    const matchedComponent = Swiftx.useState(null);
    const matchedParams = Swiftx.useState({});

    /**
     * Scoped navigation object provided to children.
     */
    const navigation = {
        /** Navigates to a new path. */
        push: (path) => navigate(path),
        /** Replaces the current history entry with a new path. */
        replace: (path) => navigate(path, { replace: true }),
        /** Navigates back in history or fallbacks to the rootPath. */
        back: (fallback = rootPath) => back(fallback),
        /** The current window path (reactive). */
        currentPath: _routeState.map(r => r.path),
        /** The root path defined for this stack. */
        rootPath
    };

    /**
     * Iterates through rules and updates the state with the first matching result.
     */
    const applyRules = () => {
        const path = _routeState.get().path;
        let activeRule = null;
        let params = {};

        // Find the first matching rule (Exact path or Parameterized)
        for (const rule of rules) {
            const result = matchPath(rule.condition, path);
            if (result.matches) {
                activeRule = rule;
                params = result.params;
                break;
            }
        }

        // If no match, fallback to the first notFound rule
        if (!activeRule) {
            activeRule = rules.find(r => r.condition === Route._NOT_FOUND);
        }

        if (!activeRule) {
            matchedComponent.set(null);
            matchedParams.set({});
            return;
        }

        matchedParams.set(params);

        // Handle Terminal Action (then)
        if (activeRule.then) {
            queueMicrotask(() => activeRule.then(navigation, params));
            return;
        }

        // Handle Terminal Render
        if (activeRule.render) {
            matchedComponent.set(activeRule.render);
        }
    };

    // Reactively update when the global route state changes
    Swiftx.useEffect(() => {
        applyRules();
    }, [_routeState]);

    /**
     * Renders the matched component with injected params and navigation.
     */
    const routerOutlet = () => Swiftx.Show(
        matchedComponent.map(m => !!m),
        () => {
            const Comp = matchedComponent.get();
            const params = matchedParams.get();
            return Comp ? Swiftx(Comp, { ...params, navigation }) : '';
        }
    );

    return layout ? Swiftx(layout, { routerOutlet, navigation }) : routerOutlet();
};
