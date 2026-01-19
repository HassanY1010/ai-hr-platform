import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import crypto from 'crypto';

const prismaInstance = new PrismaClient();

/**
 * Recursively injects UUIDs into any object lacking an 'id' within a 'create' context.
 */
const injectIds = (obj) => {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
        obj.forEach(injectIds);
        return;
    }

    // List of Prisma reserved keys that indicate a relation wrapper or operation object
    const reservedKeys = ['create', 'connect', 'connectOrCreate', 'createMany', 'upsert', 'update', 'updateMany', 'delete', 'deleteMany', 'set', 'disconnect', 'where'];

    const hasReservedKey = Object.keys(obj).some(k => reservedKeys.includes(k));

    // Heuristic: If this object is being created and lacks an ID, inject one.
    // We avoid injecting into objects that look like Prisma relation wrappers (have reserved keys).
    if (!obj.id && !hasReservedKey) {
        // Only inject if it looks like a data object (has other properties or is the root)
        const keys = Object.keys(obj);
        if (keys.length > 0) {
            obj.id = crypto.randomUUID();
        }
    }

    // Recurse into nested properties (like 'create' in relations)
    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
            injectIds(obj[key]);
        }
    });
};

const wrapModel = (model, modelName) => {
    return new Proxy(model, {
        get(modelTarget, modelProp) {
            const originalMethod = modelTarget[modelProp];
            if (typeof originalMethod === 'function' && (modelProp === 'create' || modelProp === 'upsert' || modelProp === 'createMany')) {
                return (...args) => {
                    try {
                        const params = args[0] || {};
                        if (modelProp === 'create' && params.data) {
                            injectIds(params.data);
                        } else if (modelProp === 'upsert' && params.create) {
                            injectIds(params.create);
                        } else if (modelProp === 'createMany' && params.data) {
                            if (Array.isArray(params.data)) {
                                params.data.forEach(item => {
                                    if (!item.id) item.id = crypto.randomUUID();
                                });
                            }
                        }
                    } catch (e) {
                        console.error(`[PrismaProxy] Error injecting ID into ${modelName}.${modelProp}:`, e);
                    }
                    return originalMethod.apply(modelTarget, args);
                };
            }
            return originalMethod;
        }
    });
};

const wrapClient = (client) => {
    return new Proxy(client, {
        get(target, prop) {
            // Intercept $transaction to wrap the transaction client
            if (prop === '$transaction') {
                const originalTransaction = target[prop];
                return async (...args) => {
                    const arg = args[0];
                    if (typeof arg === 'function') {
                        // Interactive transaction: wrap the 'tx' object
                        const wrappedCallback = async (tx) => {
                            return await arg(wrapClient(tx));
                        };
                        return await originalTransaction.call(target, wrappedCallback, ...(args.slice(1)));
                    }
                    // Sequential transaction
                    return await originalTransaction.apply(target, args);
                };
            }

            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop.startsWith('$'))) {
                return target[prop];
            }

            // Case-insensitive model matching
            let modelKey = prop;
            if (!(prop in target)) {
                // Find potential match in keys (excluding internals)
                const keys = Object.keys(target).filter(k => !k.startsWith('$') && !k.startsWith('_'));
                const lowerProp = prop.toLowerCase();
                const Match = keys.find(k => k.toLowerCase() === lowerProp);
                if (Match) modelKey = Match;
            }

            const model = target[modelKey];
            if (model && typeof model === 'object' && model !== null) {
                return wrapModel(model, modelKey);
            }

            return model;
        }
    });
};

const prisma = wrapClient(prismaInstance);

export default prisma;
