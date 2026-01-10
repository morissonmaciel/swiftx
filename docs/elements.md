---
layout: default
title: Elements
---

# Elements

Swiftx builds UI as VDOM using a tiny factory plus a tag DSL.

## Tag DSL

```javascript
import Swiftx from 'swiftx';
const { div, h1, p, button } = Swiftx;

const Card = () => (
    div({ class: 'card' }, [
        h1('Swiftx'),
        p('Functional-first UI.'),
        button({ click: () => alert('Clicked!') }, 'Click')
    ])
);
```

## Factory Form

```javascript
import Swiftx from 'swiftx';

const Card = () => (
    Swiftx('div', { class: 'card' }, [
        Swiftx('h1', 'Swiftx'),
        Swiftx('p', 'Functional-first UI.'),
        Swiftx('button', { click: () => alert('Clicked!') }, 'Click')
    ])
);
```

## Props and Events

Pass props as an object. Event handlers use lower-case event names like `click`.

```javascript
const Button = () => (
    Swiftx('button', { class: 'primary', click: () => alert('Saved') }, 'Save')
);
```

## Reactive Props

You can pass a state atom directly as a prop value. Swiftx will update the DOM property/attribute when the state changes.

```javascript
import Swiftx from 'swiftx';

const name = Swiftx.useState('');
const isDisabled = name.map((value) => !value);

const Form = () => (
    Swiftx('form', [
        Swiftx('input', {
            type: 'text',
            value: name,
            change: (event) => name.set(event.target.value)
        }),
        Swiftx('button', { type: 'submit', disabled: isDisabled }, 'Save')
    ])
);
```

## Children

Children can be strings, VDOM nodes, arrays, or nested component results.

```javascript
const List = () => (
    Swiftx('ul', [
        Swiftx('li', 'One'),
        Swiftx('li', 'Two')
    ])
);
```
