import Swiftx from '../swiftx/index.mjs';
import { navigate as globalNavigate } from './browser-router.mjs';

/**
 * Link Component for declarative SPA navigation.
 * 
 * @param {import('./index.d.ts').LinkProps} props - Component props.
 * @param {any} children - Link label or content.
 */
export const Link = (props, children) => {
    const { to, navigation, ...rest } = props;

    const handleClick = (e) => {
        // Prevent browser from performing a full page refresh
        e.preventDefault();

        // Use scoped navigation if provided, otherwise fallback to global engine
        if (navigation && typeof navigation.push === 'function') {
            navigation.push(to);
        } else {
            globalNavigate(to);
        }
    };

    return Swiftx('a', {
        href: to,
        click: handleClick,
        ...rest
    }, children);
};
