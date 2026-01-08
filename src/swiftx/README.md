# Swiftx Core

Swiftx is a ultra-lightweight, functional-first reactive UI framework. It focuses on simplicity, performance, and a "No Magic" approach to building web applications.

## Key Features

- **Functional Elements**: Define UI using standard JavaScript functions.
- **Reactive State**: Built-in state management using `Swiftx.useState`.
- **Side Effects**: Isolated side effects with `Swiftx.useEffect`.
- **Zero Dependencies**: Pure vanilla JavaScript with no external overhead.
- **Ultra-Light**: Less than 2KB gzipped.

## Getting Started

### Creating Elements
Swiftx provides a powerful Proxy-based DSL that allows you to destructure HTML tags and use them as functions. This eliminates repetitive strings and provides a cleaner, more readable UI structure.

```javascript
import Swiftx from 'swiftx';

// Destructure any HTML tag directly from the Swiftx object
const { div, h1, p, button } = Swiftx;

const element = (
    div({ class: 'container' }, [
        h1('Hello Swiftx!'),
        p('This is a declarative element.'),
        button({ click: () => alert('Clicked!') }, 'Click Me')
    ])
);
```

> **Note**: You can still use the traditional factory syntax if preferred: `Swiftx('div', props, children)`.


### Mounting the Application
To start your application, use the `Swiftx.render` function in your entry point file.

```javascript
import Swiftx from 'swiftx';
import App from './App.js';

// Mount the app to a DOM element with id="root"
Swiftx.render(App, document.getElementById('root'));
```

### State Management
```javascript
const counter = Swiftx.useState(0);

const CounterView = () => (
    Swiftx('div', [
        Swiftx('p', ['Count: ', counter]),
        Swiftx('button', { click: () => counter.set(counter.get() + 1) }, 'Increment')
    ])
);
```

### Side Effects (`useEffect`)
Isolated side effects that react to state changes. 

**Immediate Execution**: Unlike traditional frameworks, `Swiftx.useEffect` executes its callback **immediately** when called. This allows you to perform setup logic before the component returns its VDOM.

```javascript
Swiftx.useEffect(() => {
    console.log("Setting up component...");
    // If no dependencies are passed, this runs only once (immediately).
}, []);

Swiftx.useEffect((val) => {
    console.log("State changed to:", val);
}, [myState]);
```

### Directives

#### Conditional Rendering (`Show`)
The `Show` directive reactively toggles visibility based on a state atom. For performance, you can pass a **function** instead of VDOM to prevent the component from executing while hidden.

```javascript
import { Show } from 'swiftx';

const isVisible = Swiftx.useState(false);

const ConditionalView = () => (
    Swiftx('div', [
        // Functional approach (Recommended for complex components)
        Show(isVisible, () => Swiftx(HeavyComponent)),
        
        // Literal approach (Simple elements)
        Show(isVisible, Swiftx('p', 'Hello!')),
        
        Swiftx('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

#### Keyed Lists (`ForEach`)
Render collections from a `State` array with keyed updates. If a key is missing, Swiftx falls back to index and logs a warning.

```javascript
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

### Refs
Access raw DOM elements safely within your components.
```javascript
const inputRef = Swiftx.useRef();

const FocusView = () => (
    Swiftx('div', [
        Swiftx('input', { ref: inputRef, type: 'text' }),
        Swiftx('button', { click: () => inputRef.current.focus() }, 'Focus Input')
    ])
);
```

### Lifecycle Utilities (`whenReady`)
Execute logic after the current render pass is complete and the DOM has been updated.
```javascript
Swiftx.whenReady(() => {
    console.log("The DOM is now ready and components are mounted.");
});
```

## API Reference

- `Swiftx(tag, props, children)`: The VDOM factory.
- `Swiftx.[tag](props, children)`: Proxy-based tag factory for any HTML element (e.g., `Swiftx.div(...)`).
- `Swiftx.useState(initial)`: Creates a reactive state atom.
- `Swiftx.useEffect(callback, dependencies)`: Runs side effects when dependencies change.
- `Swiftx.useRef()`: Creates a persistent reference for DOM nodes (accessed via `.current`).
- `Swiftx.whenReady(callback)`: Schedules a callback to run after the next render pass.
- `Swiftx.render(vdom, container)`: Mounts the application to the DOM.
- `Swiftx.Show(state, content)`: Conditional rendering directive.
