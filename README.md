# Swiftx

Swiftx is an ultra-lightweight, functional-first UI framework with a minimal router. It favors explicit, "no magic" APIs, reactive state, and a tiny footprint.

## Why Swiftx

- **Functional elements**: build UI with plain functions or a Proxy-based tag DSL.
- **Reactive state**: `useState` atoms update the DOM with minimal overhead.
- **Immediate effects**: `useEffect` runs immediately for predictable setup.
- **Super lightweight**: core stays under ~2KB gzipped.
- **No dependencies**: vanilla JS, small bundle size.
- **Router included**: opt-in, scoped navigation with a fluent API.

## Install

```bash
npm install swiftx
```

## Quick Start

```js
import Swiftx, { BrowserRouter, RouterStack, Route, Link } from 'swiftx';

const Home = () => (
    <div>
        <h1>Home</h1>
        <Link to="/about">About</Link>
    </div>
);

const About = () => <div>About</div>;

const App = () => (
    <RouterStack
        rootPath="/"
        rules={[
            Route.on('/').render(Home),
            Route.on('/about').render(About),
            Route.notFound.render(() => <div>Not found</div>)
        ]}
    />
);

Swiftx.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);
```

## Core Usage

### Elements
Use the tag DSL for concise markup, or the factory for explicit control.

```js
import Swiftx from 'swiftx';
const { div, h1, p, button } = Swiftx;

const View = () => (
    div({ class: 'panel' }, [
        h1('Hello Swiftx'),
        p('A tiny functional-first UI framework.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

### State and Effects

```js
import Swiftx from 'swiftx';

const count = Swiftx.useState(0);

const Counter = () => (
    Swiftx('div', [
        Swiftx('p', ['Count: ', count]),
        Swiftx('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);

Swiftx.useEffect(() => {
    console.log('Effect runs immediately on call');
}, []);
```

### Keyed List Updates

```js
import Swiftx from 'swiftx';

const expenses = Swiftx.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const ExpenseList = () => (
    Swiftx('ul', [
        Swiftx.ForEach(expenses, 'id', (item) =>
            Swiftx('li', item.label)
        )
    ])
);
```

### Conditional Rendering

```js
import Swiftx, { Show } from 'swiftx';
const isVisible = Swiftx.useState(false);

const Panel = () => (
    Swiftx('div', [
        Show(isVisible, () => Swiftx('p', 'Now you see me')),
        Swiftx('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## Router Overview

Swiftx Router is scoped and context-aware. You define routes with a fluent API and receive a `navigation` object in matched components or layouts.

```js
import Swiftx, { RouterStack, Route, Link } from 'swiftx';

const App = () => (
    RouterStack(
        '/',
        [
            Route.on('/').render(Home),
            Route.on('/user/:id').render(UserProfile),
            Route.notFound.render(NotFound)
        ],
        AppLayout
    )
);
```

## API Highlights

- `Swiftx(tag, props, children)` or `Swiftx.[tag](props, children)`
- `Swiftx.useState(initial)`, `Swiftx.useEffect(cb, deps)`, `Swiftx.useRef()`
- `Swiftx.whenReady(cb)`, `Swiftx.render(vdom, container)`
- `Show(state, content)`, `Swiftx.ForEach(state, key, render)`
- Router: `BrowserRouter`, `RouterStack`, `Route`, `Link`

## Docs

- Core framework: `src/swiftx/README.md`
- Router: `src/swiftx-router/README.md`

## License

ISC
