/**
 * Navigation object injected into components and layouts.
 */
export interface Navigation {
    /** Navigates to a new path. */
    push(path: string): void;
    /** Replaces current history entry. */
    replace(path: string): void;
    /** Navigates back or to fallback. */
    back(fallback?: string): void;
    /** Reactive state containing the current path string. */
    currentPath: any;
    /** The base path of the current navigation stack. */
    rootPath: string;
}

/**
 * Route rule builder.
 */
export interface RouteBuilder {
    render(component: any): any;
    then(callback: (navigation: Navigation, params: Record<string, string>) => void): any;
}

/**
 * Fluent API for defining routes.
 */
export const Route: {
    /** Define a rule for a specific path (e.g., '/', '/user/:id'). */
    on(path: string): RouteBuilder;
    /** Define a fallback rule. */
    notFound: RouteBuilder;
};

/**
 * Props for the RouterStack component.
 */
export interface RouterStackProps {
    rootPath: string;
    rules: any[];
    layout?: (props: { routerOutlet: () => any, navigation: Navigation }) => any;
}

export function RouterStack(props: RouterStackProps): any;
export function RouterStack(
    rootPath: string,
    rules: any[],
    layout?: (props: { routerOutlet: () => any, navigation: Navigation }) => any
): any;
export function BrowserRouter(child: any): any;

export interface LinkProps {
    to: string;
    navigation?: Navigation;
    [key: string]: any;
}

export function Link(props: LinkProps, children: any): any;

export const SwiftxRouter: {
    BrowserRouter: typeof BrowserRouter;
    RouterStack: typeof RouterStack;
    Route: typeof Route;
    Link: typeof Link;
};

export default SwiftxRouter;
