/**
 * Internal helper to create a fluent rule builder for a given route condition.
 * 
 * @param {string} condition - The path pattern or NOT_FOUND constant to match.
 * @returns {Object} A builder object with terminal actions.
 */
const createBuilder = (condition) => ({
    /**
     * Terminally render a component or VDOM element for this route.
     * 
     * @param {Function|DOMNode} content - The component or element to render.
     * @returns {Object} A route rule definition.
     */
    render: (content) => ({
        condition,
        render: content
    }),

    /**
     * Terminally execute a side-effect callback for this route.
     * Useful for redirects or logging.
     * 
     * @param {Function} callback - A function receiving (navigation, params).
     * @returns {Object} A route rule definition.
     */
    then: (callback) => ({
        condition,
        then: callback
    })
});

/**
 * Unified Fluent Route API for defining navigation rules.
 * Use Swiftx.Route.on(path) for specific routes and Swiftx.Route.notFound for fallbacks.
 */
export const Route = {
    /**
     * Starts defining a rule for a specific path.
     * 
     * @param {string} path - The path pattern (e.g., '/', '/user/:id').
     * @returns {Object} A fluent rule builder.
     */
    on: (path) => createBuilder(path),

    /**
     * Starts defining a rule for when no other path matches.
     * 
     * @returns {Object} A fluent rule builder.
     */
    notFound: createBuilder('__swiftx_not_found__'),

    /**
     * Internal constant used to identify the fallback route.
     * @internal
     */
    _NOT_FOUND: '__swiftx_not_found__'
};
