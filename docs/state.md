---
layout: default
title: State
---

# State

`useState` returns a reactive state atom. The atom exposes `get`, `set`, `subscribe`, and `map`.

## Basic State

```javascript
import Swiftx from 'swiftx';

const count = Swiftx.useState(0);

const Counter = () => (
    Swiftx('div', [
        Swiftx('p', ['Count: ', count]),
        Swiftx('button', { click: () => count.set(count.get() + 1) }, 'Increment')
    ])
);
```

## Derived State with map

```javascript
const count = Swiftx.useState(2);
const doubled = count.map((value) => value * 2);

const View = () => (
    Swiftx('p', ['Double: ', doubled])
);
```

## Subscriptions

Use `subscribe` for side effects or interop when you need to observe changes.

```javascript
const count = Swiftx.useState(0);

const unsubscribe = count.subscribe((value) => {
    console.log('Count changed:', value);
});

// Later, call unsubscribe() to stop listening.
```

## Reactive Props

You can pass state atoms directly to element props to keep the DOM in sync.

```javascript
const name = Swiftx.useState('');
const disabled = name.map((value) => !value);

const Form = () => (
    Swiftx('form', [
        Swiftx('input', {
            type: 'text',
            value: name,
            change: (event) => name.set(event.target.value)
        }),
        Swiftx('button', { disabled }, 'Save')
    ])
);
```
