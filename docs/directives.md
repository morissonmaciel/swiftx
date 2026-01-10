---
layout: default
title: Directives
---

# Directives

Swiftx provides two rendering directives: `Show` and `ForEach`.

## Show

Use `Show` for conditional rendering. Pass a function to avoid evaluating heavy content while hidden.

```javascript
import Swiftx, { Show } from 'swiftx';

const isVisible = Swiftx.useState(false);

const Panel = () => (
    Swiftx('div', [
        Show(isVisible, () => Swiftx('p', 'Visible')),
        Swiftx('button', { click: () => isVisible.set(!isVisible.get()) }, 'Toggle')
    ])
);
```

## ForEach

`ForEach` renders a list and updates by key. You can pass the key as a string or an options object.

```javascript
const items = Swiftx.useState([
    { id: 1, label: 'Rent' },
    { id: 2, label: 'Food' }
]);

const List = () => (
    Swiftx('ul', [
        Swiftx.ForEach(items, 'id', (item) =>
            Swiftx('li', item.label)
        )
    ])
);
```

```javascript
Swiftx.ForEach(items, { key: 'id' }, (item, index) =>
    Swiftx('li', `${index + 1}. ${item.label}`)
);
```

### Form Binding Example

You can bind input fields to items in a collection and derive form state.

```javascript
const users = Swiftx.useState([
    { id: 1, name: '' },
    { id: 2, name: '' }
]);
const disabled = users.map((list) =>
    !list.every((user) => user.name.trim().length > 0)
);

const Form = () => (
    Swiftx('form', [
        Swiftx('div', [
            Swiftx.ForEach(users, 'id', (user, index) =>
                Swiftx('input', {
                    type: 'text',
                    value: user.name,
                    change: (event) => {
                        const next = users.get().map((item, i) =>
                            i === index ? { ...item, name: event.target.value } : item
                        );
                        users.set(next);
                    }
                })
            )
        ]),
        Swiftx('button', { type: 'submit', disabled }, 'Submit')
    ])
);
```
