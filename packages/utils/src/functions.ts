export const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

export const throttle = (fn: Function, ms = 300) => {
    let wait = false;
    return function (this: any, ...args: any[]) {
        if (!wait) {
            fn.apply(this, args);
            wait = true;
            setTimeout(() => (wait = false), ms);
        }
    };
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
