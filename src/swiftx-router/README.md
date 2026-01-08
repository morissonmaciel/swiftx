# Swiftx Router

A decentralized, context-aware routing solution for the Swiftx framework.

## Key Features

- **Fluent API**: Define routes using a readable, chainable syntax.
- **Decentralized Navigation**: No global navigation objects. Everything is passed as a scoped `navigation` prop.
- **Context-Aware `back()`**: Smart history management with automatic fallback to stack root.
- **Dynamic Parameters**: Parse URL segments like `:id` or `:slug` automatically.
- **Layout Support**: Native support for persistent layouts with `routerOutlet`.

## Bootstrap
To enable routing, you must wrap your root component in the `BrowserRouter` when calling the render function.

```javascript
import Swiftx, { BrowserRouter } from 'swiftx';
import App from './App.js';

Swiftx.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
```

## Example Usage

### Setting up the Stack
```javascript
import Swiftx, { RouterStack, Route, Link } from 'swiftx';

const App = () => (
    RouterStack(
        '/',
        [
            Route.on('/').render(Home),
            Route.on('/user/:id').render(UserProfile),
            
            // Side-effects / Redirects
            Route.on('/legacy-path').then((navigation, params) => {
                console.log('Redirecting...');
                navigation.replace('/form');
            }),
            
            Route.notFound.render(NotFound)
        ],
        AppLayout
    )
);
```

### Route Terminal Actions
A route rule must end with either `.render()` or `.then()`.

- **`.render(Component|VDOM)`**: Renders the specified content into the `routerOutlet`.
- **`.then((navigation, params) => { ... })`**: Executes a callback instead of rendering. Ideal for custom redirects or analytics.

### Layouts & Router Outlet
Layouts allow you to wrap your routes with persistent UI (like navbars or sidebars). A layout component receives two special props: `routerOutlet` and `navigation`.

```javascript
import { Link } from 'swiftx';

/**
 * @param {Function} props.routerOutlet - A function that returns the matched route content.
 * @param {Object} props.navigation - The scoped navigation object.
 */
function AppLayout({ routerOutlet, navigation }) {
    return Swiftx('div', { class: 'layout' }, [
        Swiftx('nav', [
            Link({ to: '/', navigation }, 'Home'),
            Link({ to: '/form', navigation }, 'Form')
        ]),
        Swiftx('main', [
            // Call the outlet to render the matched route component
            routerOutlet()
        ])
    ]);
}
```

#### With vs Without Layout
- **With Layout**: The `RouterStack` renders the layout component. The matched route is **not** visible until you call `props.routerOutlet()` inside the layout's VDOM.
- **Without Layout**: The `RouterStack` renders the matched route component directly as its only content. This is useful for simple apps or sub-stacks that don't need persistent wrapper UI.


### Consuming Navigation
Matched components and layouts receive the `navigation` object.

```javascript
function Home({ navigation }) {
    return Swiftx('div', [
        Swiftx('h1', 'Home Page'),
        Swiftx('button', { 
            click: () => navigation.push('/user/123') 
        }, 'View User')
    ]);
}
```

### Navigation Object Reference

- `navigation.push(path)`: Navigates to a new URL.
- `navigation.replace(path)`: Replaces the current history entry.
- `navigation.back(fallback?)`: Goes back in history or to the fallback (defaults to `rootPath`).
- `navigation.currentPath`: Reactive state containing the current window path.
- `navigation.rootPath`: The base path of the current stack.

## Components

- `BrowserRouter`: The root container for your routing tree.
- `RouterStack`: Manages a set of routes and their lifecycles.
- `Link`: A helper component for declarative navigation: `Link({ to: '/path', navigation }, 'Label')`.
