---
layout: default
title: Core Overview
---

# Core Overview

Swiftx is intentionally small: a VDOM factory, a tag DSL, reactive state, immediate effects, and a handful of directives.

## The Core Pieces

- **Elements**: build VDOM with `Swiftx('div', ...)` or the tag DSL (`Swiftx.div(...)`).
- **Render**: mount your root with `Swiftx.render`.
- **State**: `useState` returns a state atom with `get`, `set`, `subscribe`, and `map`.
- **Effects**: `useEffect` runs immediately for predictable setup and can return cleanup.
- **Directives**: `Show` and `ForEach` handle conditional rendering and keyed lists.
- **Refs**: `useRef` gives you a stable `{ current }` pointer.
- **Lifecycle**: `whenReady` runs after the current render pass.
- **Reactive props**: pass state atoms directly to element props like `disabled` or `value`.

## Read Next

- [Elements](./elements.md)
- [Rendering](./rendering.md)
- [State](./state.md)
- [Effects](./effects.md)
- [Directives](./directives.md)
- [Refs](./refs.md)
- [Lifecycle](./lifecycle.md)
- [JSX](./jsx.md)
