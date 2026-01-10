export function isDev() {
    return typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
}
