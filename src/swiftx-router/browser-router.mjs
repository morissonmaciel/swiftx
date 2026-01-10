import Swiftx from '../swiftx/index.mjs';
import { isDev } from '../swiftx/dev.mjs';

/**
 * Reactive state containing the current window location path.
 */
export const _routeState = Swiftx.State({ path: window.location.pathname });

/**
 * Global counter used to validate that a RouterStack is present within a BrowserRouter.
 * @internal
 */
export let _routerStackCount = 0;

/**
 * Resets the router stack counter.
 * @internal
 */
export const resetRouterCount = () => _routerStackCount = 0;

/**
 * Increments the router stack counter.
 * @internal
 */
export const incrementRouterCount = () => _routerStackCount++;

// Convenience getter for current route state
Object.defineProperty(_routeState, 'current', {
    get: () => _routeState.get()
});

// Listen for browser back/forward navigation
window.addEventListener('popstate', () => {
    _routeState.set({ path: window.location.pathname });
});

/**
 * Internal tracker for pushes to the history stack.
 * Used by the back() function to determine if it should navigate back or to a fallback.
 */
let _internalHistoryCount = 0;

/**
 * Programmatically updates the browser URL and triggers a route update.
 * 
 * @param {string} path - The target path to navigate to.
 * @param {Object} [options={}] - Navigation options.
 * @param {boolean} [options.replace=false] - If true, replaces the current history entry instead of pushing a new one.
 */
export const navigate = (path, options = {}) => {
    if (window.location.pathname !== path) {
        if (options.replace) {
            window.history.replaceState({}, '', path);
        } else {
            window.history.pushState({}, '', path);
            _internalHistoryCount++;
        }
        _routeState.set({ path });
    }
};

/**
 * Navigates back in history if possible, otherwise navigates to a fallback path.
 * 
 * @param {string} [fallback='/'] - The path to navigate to if no internal history exists.
 */
export const back = (fallback = '/') => {
    if (_internalHistoryCount > 0) {
        _internalHistoryCount--;
        window.history.back();
    } else {
        navigate(fallback, { replace: true });
    }
};

/**
 * Root router component that provides navigation context to the application.
 * Validates that at least one RouterStack is rendered within its tree.
 * 
 * @param {Object|Function} props - Props or direct child when called as function.
 * @param {Array} [children] - Children when used as a JSX component.
 * @returns {DOMNode} The rendered content.
 */
export const BrowserRouter = (props, children) => {
    resetRouterCount();

    let content = props?.children ?? (children && children.length ? children : props);
    if (Array.isArray(content)) {
        content = content.length === 1 ? content[0] : Swiftx('div', {}, content);
    }
    const resolved = typeof content === 'function' ? Swiftx(content) : content;

    Swiftx.whenReady(() => {
        if (_routerStackCount === 0 && isDev()) {
            console.error("Swiftx.BrowserRouter: No RouterStack found inside the Router tree. Please add a RouterStack.");
        }
    });

    return resolved;
};
