import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { memoryCache } from '../utils/cache.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const error = new Error('You are not logged in. Please log in to get access.');
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const cacheKey = `user_auth_${decoded.id}`;
        let user = memoryCache.get(cacheKey);

        if (!user) {
            user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: { company: true },
            });

            if (user) {
                memoryCache.set(cacheKey, user, 60); // Cache for 1 minute
            }
        }

        if (!user) {
            const error = new Error('The user belonging to this token no longer exists.');
            error.statusCode = 401;
            throw error;
        }

        // Grant access to protected route
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error('You do not have permission to perform this action');
            error.statusCode = 403;
            throw error;
        }
        next();
    };
};
