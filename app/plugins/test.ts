export default defineNuxtPlugin(() => {
    if (typeof window !== 'undefined') {
        if (!('requestIdleCallback' in window)) {
            window.requestIdleCallback = function (cb) {
                return setTimeout(() => {
                    cb({
                        didTimeout: false,
                        timeRemaining: () => Math.max(0, 50)
                    });
                }, 1);
            };

            window.cancelIdleCallback = function (id) {
                clearTimeout(id);
            };
        }
    }
});