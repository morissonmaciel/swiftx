---
layout: default
title: SVG Components
---

# SVG Components

Swiftx can render inline SVGs as components when your build pipeline converts `.svg` files into Swiftx-compatible JSX.

## Why Inline SVG

Using an inline `<svg>` lets you style fills and strokes via CSS (e.g. `color: ...`), and keeps the icon crisp at any size.

## Webpack + SVGR Setup

This setup uses a custom SVGR template and runs `babel-loader` after SVGR so JSX compiles to `Swiftx(...)` instead of `React.createElement`.

Create a template file at `swiftx-svgr-template.js`:

```javascript
// swiftx-svgr-template.js
module.exports = (variables, { tpl }) => {
    const { componentName, jsx } = variables;
    return tpl`
        import Swiftx from 'swiftx';
        const ${componentName} = (props) => ${jsx};
        export default ${componentName};
    `;
};
```

```javascript
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-react', {
                                    runtime: 'classic',
                                    pragma: 'Swiftx',
                                    pragmaFrag: 'Swiftx.Fragment'
                                }]
                            ]
                        }
                    },
                    {
                        loader: '@svgr/webpack',
                        options: {
                            exportType: 'default',
                            babel: false,
                            template: require('./swiftx-svgr-template.js'),
                            svgo: true,
                            svgoConfig: {
                                plugins: [
                                    {
                                        name: 'convertColors',
                                        params: { currentColor: true }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    }
};
```

## Usage

```javascript
import Swiftx from 'swiftx';
import Logo from './logo.svg';

const App = () => (
    <div class="brand">
        <Logo class="icon" width="24" height="24" />
        <span>Swiftx</span>
    </div>
);
```

```css
.brand .icon {
    color: #ff3b30;
}
```

If your loader exports a named component instead of a default, the import must match the export. For example:

```javascript
import { ReactComponent as Logo } from './logo.svg';
```

## Notes

- Ensure your project JSX also compiles with `pragma: 'Swiftx'`.
- If you import SVGs as URLs, use `<img src={logoUrl} />`, but you cannot style internal paths.
