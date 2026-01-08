export function State(value) {
    const listeners = []
    return {
        get: () => value,
        set: (v) => {
            value = v;
            listeners.forEach(cb => cb(v))
        },
        subscribe: (cb) => {
            listeners.push(cb)
            return () => {
                const i = listeners.indexOf(cb)
                if (i > -1) listeners.splice(i, 1)
            }
        },
        map: (fn) => {
            const derived = State(fn(value))
            listeners.push(v => derived.set(fn(v)))
            return derived
        }
    }
}

export function Effect(cb, deps) {
    const rawDeps = deps ? (Array.isArray(deps) ? deps : [deps]) : []
    const states = rawDeps.filter(s => s && typeof s.get === 'function' && typeof s.subscribe === 'function')
    const disposers = states.map(s => s.subscribe(cb))

    const firstStateValue = states.length === 1 ? states[0].get() : undefined
    cb(firstStateValue)

    return () => disposers.forEach(d => d?.())
}
