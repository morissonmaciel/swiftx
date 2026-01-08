/**
 * Converts virtual elements to real DOM nodes.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

export function swiftxToDOM(element, svgContext = false) {
    if (!element) return document.createTextNode('')

    // Execute functional components
    if (typeof element.tag === 'function') {
        return swiftxToDOM(element.tag(element.props, element.children), svgContext)
    }

    // Pass through real DOM nodes
    if (element instanceof Node) return element

    // Bind reactive state
    if (element.subscribe && typeof element.get === 'function') {
        const textNode = document.createTextNode(element.get())
        element.subscribe(val => textNode.textContent = val)
        return textNode
    }

    if (typeof element === 'string') return document.createTextNode(element)

    const isSvg = svgContext || element.tag === 'svg'
    const node = isSvg
        ? document.createElementNS(SVG_NS, element.tag)
        : document.createElement(element.tag)

    if (element.props) {
        for (const [key, value] of Object.entries(element.props)) {
            if (key === 'ref') {
                value.current = node
                continue
            }
            if (key === 'style' && typeof value === 'object') {
                for (const [styleKey, styleVal] of Object.entries(value)) {
                    if (styleVal && typeof styleVal.get === 'function' && typeof styleVal.subscribe === 'function') {
                        node.style[styleKey] = styleVal.get();
                        styleVal.subscribe((nextVal) => {
                            node.style[styleKey] = nextVal;
                        });
                    } else {
                        node.style[styleKey] = styleVal;
                    }
                }
                continue
            }
            if (value === true) {
                node.setAttribute(key, '')
            } else if (value !== false && value !== null && value !== undefined) {
                if (isSvg && key === 'xlink:href') {
                    node.setAttributeNS(XLINK_NS, 'xlink:href', value)
                } else {
                    node.setAttribute(key, value)
                }
            }
        }
    }

    if (element.events) {
        for (const [name, callback] of Object.entries(element.events)) {
            node.addEventListener(name, callback)
        }
    }

    if (element.children) {
        for (const child of element.children) {
            node.appendChild(swiftxToDOM(child, isSvg))
        }
    }

    return node
}
