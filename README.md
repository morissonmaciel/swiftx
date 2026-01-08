# Swiftx

Swiftx is an ultra-lightweight, functional-first UI framework with a small router packaged together in a single module.

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

## Exports

- `Swiftx` (default export)
- `SwiftxRouter`
- `BrowserRouter`, `RouterStack`, `Route`, `Link`
- `useState`, `useEffect`, `useRef`, `whenReady`, `render`, `Show`

## License

ISC
