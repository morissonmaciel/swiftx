/**
 * Swiftx Core Type Definitions
 */

export interface State<T> {
    get(): T;
    set(value: T): void;
    subscribe(callback: (value: T) => void): () => void;
    map<R>(fn: (value: T) => R): State<R>;
}

export type VNode = {
    tag: any;
    props: any;
    events: any;
    children: any[];
};

export interface SwiftxFactory {
    (tag: any, propsOrChildren?: any, ...children: any[]): VNode;

    useState<T>(initialValue: T): State<T>;
    useEffect(callback: (val?: any) => void | (() => void), dependencies?: any[]): void;
    useRef<T = any>(): { current: T };
    render(component: any, container: HTMLElement | null): void;
    whenReady(callback: () => void): void;
    Show(state: State<boolean>, content: any): any;
    ForEach<T>(
        items: State<T[]> | T[],
        options: { key?: keyof T } | keyof T,
        render: (item: T, index: number) => any
    ): any;
    State: typeof State;
    Effect: typeof Effect;
    Ref: () => { current: any };
    /** Dynamic tag factory (e.g., Swiftx.div(...)) */
    [tag: string]: any;
}

declare const Swiftx: SwiftxFactory;
export default Swiftx;
