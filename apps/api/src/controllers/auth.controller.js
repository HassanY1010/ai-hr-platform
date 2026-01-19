import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { company: true },
        });

        if (!user) {
            const error = new Error('البريد الإلكتروني غير مسجل');
            error.statusCode = 401;
            error.field = 'email';
            throw error;
        }

        if (password !== user.passwordHash) {
            const error = new Error('كلمة المرور غير صحيحة');
            error.statusCode = 401;
            error.field = 'password';
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date(),
                updatedAt: new Date()
            }
        });

        const dashboardUrls = {
            'SUPER_ADMIN': process.env.OWNER_DASHBOARD_URL || 'http://localhost:3004/',
            'MANAGER': process.env.MANAGER_DASHBOARD_URL || 'http://localhost:3002',
            'EMPLOYEE': process.env.EMPLOYEE_PWA_URL || 'http://localhost:3001'
        };

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                dashboardUrl: dashboardUrls[user.role] || process.env.DEFAULT_DASHBOARD_URL || 'http://localhost:3000'
            },
        });
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        console.log('--- REGISTER ATTEMPT ---');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body keys:', Object.keys(req.body));
        console.log('Body:', JSON.stringify(req.body, (key, value) =>
            key === 'password' ? '***' : value, 2));

        // Normalize fields from user spec to internal names
        const name = req.body.name || req.body.fullName;
        const email = req.body.email;
        const companyName = req.body.companyName;
        const employeeLimit = req.body.employeeCount || 10;
        const language = req.body.language || 'ar';
        const { password, role, subscriptionCode } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const error = new Error('البريد الإلكتروني مسجل بالفعل');
            error.statusCode = 400;
            throw error;
        }

        let validSubscriptionCode = null;

        // Validate subscription code if registering a company
        if (companyName) {
            if (!subscriptionCode || subscriptionCode.trim() === '') {
                const error = new Error('رمز الاشتراك مطلوب [DEBUG-V2]');
                error.statusCode = 400;
                throw error;
            }

            validSubscriptionCode = await prisma.subscriptionCode.findUnique({
                where: { code: subscriptionCode }
            });

            if (!validSubscriptionCode) {
                const error = new Error('رمز الاشتراك غير صالح');
                error.statusCode = 400;
                throw error;
            }

            if (validSubscriptionCode.status !== 'UNUSED') {
                const error = new Error('رمز الاشتراك مستخدم مسبقاً');
                error.statusCode = 400;
                throw error;
            }
        }

        const passwordHash = password; // Storing as plain text per user request for demo

        // Use a transaction to create company, user, and subscription
        const result = await prisma.$transaction(async (tx) => {
            let company;
            if (companyName) {
                company = await tx.company.create({
                    data: {
                        name: companyName,
                        employeeLimit: parseInt(employeeLimit),
                        language: language,
                        updatedAt: new Date()
                    },
                });

                // Mark subscription code as used
                // SubscriptionCode doesn't have updatedAt in schema
                await tx.subscriptionCode.update({
                    where: { id: validSubscriptionCode.id },
                    data: {
                        status: 'USED',
                        companyId: company.id,
                        usedAt: new Date()
                    }
                });

                // Create initial subscription
                const trialEndDate = new Date();
                trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 days trial

                await tx.subscription.create({
                    data: {
                        companyId: company.id,
                        plan: 'FREE_TRIAL',
                        endDate: trialEndDate,
                        status: 'ACTIVE',
                        updatedAt: new Date()
                    }
                });
            }

            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role: role || (companyName ? 'MANAGER' : 'EMPLOYEE'),
                    companyId: company ? company.id : (req.body.companyId || null),
                    updatedAt: new Date()
                },
                include: { company: true },
            });

            return user;
        });

        const token = jwt.sign(
            { id: result.id, email: result.email, role: result.role, companyId: result.companyId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const dashboardUrls = {
            'SUPER_ADMIN': process.env.OWNER_DASHBOARD_URL || 'http://localhost:3004',
            'MANAGER': process.env.MANAGER_DASHBOARD_URL || 'http://localhost:3002',
            'EMPLOYEE': process.env.EMPLOYEE_PWA_URL || 'http://localhost:3001'
        };

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: result.id,
                name: result.name,
                email: result.email,
                role: result.role,
                company: result.company,
                dashboardUrl: dashboardUrls[result.role] || process.env.DEFAULT_DASHBOARD_URL || 'http://localhost:3000'
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                company: true
            }
        });

        if (!user) {
            const error = new Error('البريد الإلكتروني غير مسجل في النظام');
            error.statusCode = 404;
            throw error;
        }

        // Fetch manager manually to avoid Prisma selection conflict with relation named 'user'
        if (user.managerId) {
            user.user = await prisma.user.findUnique({
                where: { id: user.managerId }
            });
        }

        let contactEmail = null;
        let contactRole = null;

        if (user.role === 'EMPLOYEE') {
            // First try assigned manager
            if (user.user && user.user.email) {
                contactEmail = user.user.email;
            } else {
                // Fallback to searching for any active manager in the same company
                const manager = await prisma.user.findFirst({
                    where: {
                        companyId: user.companyId,
                        role: 'MANAGER',
                        status: 'ACTIVE'
                    }
                });
                contactEmail = manager ? manager.email : null;
            }
            contactRole = 'MANAGER';
        } else if (user.role === 'MANAGER' || user.role === 'ADMIN') {
            // Find super admin
            const superAdmin = await prisma.user.findFirst({
                where: {
                    role: 'SUPER_ADMIN',
                    status: 'ACTIVE'
                }
            });
            contactEmail = superAdmin ? superAdmin.email : null;
            contactRole = 'SUPER_ADMIN';
        }

        res.status(200).json({
            status: 'success',
            data: {
                role: user.role,
                contactEmail,
                contactRole
            }
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        // TODO: Validate token

        const passwordHash = await bcrypt.hash(newPassword, 12);

        // For now, we can't really update without a valid user ID associated with the token
        // This is a placeholder for the frontend flow

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        // Simple refresh: check if user exists from current valid token
        // In a real app, you'd verify a helper Refresh Token
        // Here we'll just require authentication middleware to call this

        const user = req.user; // Set by protect middleware

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, companyId: user.companyId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        next(error);
    }
};
