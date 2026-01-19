import prisma from '../config/db.js';

export const getAllCompanies = async (req, res, next) => {
    try {
        const companies = await prisma.company.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ status: 'success', data: { companies } });
    } catch (error) {
        next(error);
    }
};

export const createCompany = async (req, res, next) => {
    try {
        const data = { ...req.body }

        // Ensure settings is stringified if it's an object
        if (data.settings && typeof data.settings === 'object') {
            data.settings = JSON.stringify(data.settings)
        }

        const company = await prisma.company.create({
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
        res.status(201).json({ status: 'success', data: { company } });
    } catch (error) {
        next(error);
    }
};

export const getCompanyById = async (req, res, next) => {
    try {
        const company = await prisma.company.findUnique({ where: { id: req.params.id } });
        if (!company) {
            const error = new Error('Company not found');
            error.statusCode = 404;
            throw error;
        }
        if (company.settings && typeof company.settings === 'string') {
            try {
                company.settings = JSON.parse(company.settings);
            } catch (error) {
                console.error('Failed to parse company settings:', error);
                company.settings = {};
            }
        }
        res.status(200).json({ status: 'success', data: { company } });
    } catch (error) {
        next(error);
    }
};

export const updateCompany = async (req, res, next) => {
    try {
        const { id, createdAt, updatedAt, _count, subscription, userCount, revenue, contact, status, domain, ...rest } = req.body;

        const updatePayload = {
            ...rest,
            updatedAt: new Date()
        };

        if (domain) updatePayload.website = domain;

        // Remove known non-schema fields that might slip through
        delete updatePayload.size;
        delete updatePayload.industry;

        // Important: The schema doesn't have 'industry', 'size', 'status' fields directly on Company model based on usage. 
        // Wait, looking at schema: 
        // Company model has: id, name, subscriptionStatus, subscriptionExpiry, createdAt, updatedAt, address, employeeLimit, language, logo, settings, website.
        // It DOES NOT have: industry, size, status (status is subscriptionStatus?), revenue, userCount.

        // Mapping strategy:
        // domain -> website
        // status -> subscriptionStatus (maybe?)

        // Let's explicitly cherry-pick valid fields to be safe.
        const validFields = ['name', 'subscriptionStatus', 'subscriptionExpiry', 'address', 'employeeLimit', 'language', 'logo', 'settings', 'website'];
        const cleanData = {};

        // Map incoming data to schema fields
        if (req.body.name) cleanData.name = req.body.name;
        if (req.body.domain) cleanData.website = req.body.domain;
        if (req.body.website) cleanData.website = req.body.website;

        // For other fields, we check if they exist in valid fields
        Object.keys(req.body).forEach(key => {
            if (validFields.includes(key)) {
                cleanData[key] = req.body[key];
            }
        });

        const company = await prisma.company.update({
            where: { id: req.params.id },
            data: {
                ...cleanData,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ status: 'success', data: { company } });
    } catch (error) {
        next(error);
    }
};

export const updateMyCompany = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(403).json({ status: 'error', message: 'Not associated with a company' });
        }

        const company = await prisma.company.update({
            where: { id: companyId },
            data: {
                ...req.body,
                settings: req.body.settings && typeof req.body.settings === 'object' ? JSON.stringify(req.body.settings) : req.body.settings,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ status: 'success', data: { company } });
    } catch (error) {
        next(error);
    }
};

export const getMyCompany = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(403).json({ status: 'error', message: 'Not associated with a company' });
        }

        const company = await prisma.company.findUnique({ where: { id: companyId } });
        res.status(200).json({ status: 'success', data: { company } });
    } catch (error) {
        next(error);
    }
};

export const deleteCompany = async (req, res, next) => {
    try {
        await prisma.company.delete({ where: { id: req.params.id } });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
