import prisma from '../config/db.js';
import { createNotification } from './notification.controller.js';

// apps/api/src/controllers/employee.controller.js
export const getAllEmployees = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;
        const employees = await prisma.employee.findMany({
            where: { companyId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        avatar: true,
                    }
                }
            }
        });
        res.status(200).json({ status: 'success', data: employees });
    } catch (error) {
        next(error);
    }
};

export const createEmployee = async (req, res, next) => {
    try {
        const { name, email, department, position, startDate, password } = req.body;
        const companyId = req.user.companyId;

        // Use transaction to ensure both user and employee are created
        const result = await prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({ where: { email } });

            if (!user) {
                user = await tx.user.create({
                    data: {
                        name,
                        email,
                        passwordHash: password || 'password123', // Use provided password or default
                        role: 'EMPLOYEE',
                        companyId,
                        managerId: req.user.id,
                        updatedAt: new Date()
                    }
                });
            }

            const existingEmployee = await tx.employee.findUnique({ where: { userId: user.id } });
            if (existingEmployee) {
                throw new Error('Employee already exists for this user');
            }

            const employee = await tx.employee.create({
                data: {
                    userId: user.id,
                    companyId,
                    department,
                    position,
                    startDate: startDate ? new Date(startDate) : new Date(),
                    status: 'active',
                    updatedAt: new Date()
                },
                include: { user: true }
            });

            return employee;
        });

        res.status(201).json({ status: 'success', data: { employee: result } });
    } catch (error) {
        if (error.message === 'Employee already exists for this user') {
            return res.status(400).json({ status: 'error', message: error.message });
        }
        next(error);
    }
};

// Bulk Import Employees
export const bulkCreateEmployees = async (req, res, next) => {
    try {
        const { employees } = req.body;
        const companyId = req.user.companyId;

        if (!Array.isArray(employees)) {
            return res.status(400).json({ status: 'error', message: 'Invalid data format. Expected an array of employees.' });
        }

        const results = [];
        const errors = [];

        // Process in a loop for simplicity and individual error handling per record
        // In a high-scale app, you might want to use a more optimized bulk insert strategy
        for (const empData of employees) {
            try {
                const { name, email, department, position, startDate, password } = empData;

                const result = await prisma.$transaction(async (tx) => {
                    let user = await tx.user.findUnique({ where: { email } });

                    if (!user) {
                        user = await tx.user.create({
                            data: {
                                name,
                                email,
                                passwordHash: password || 'password123',
                                role: 'EMPLOYEE',
                                companyId,
                                managerId: req.user.id,
                                updatedAt: new Date()
                            }
                        });
                    }

                    const existingEmployee = await tx.employee.findUnique({ where: { userId: user.id } });
                    if (existingEmployee) {
                        throw new Error(`Employee with email ${email} already exists`);
                    }

                    return await tx.employee.create({
                        data: {
                            userId: user.id,
                            companyId,
                            department,
                            position,
                            startDate: startDate ? new Date(startDate) : new Date(),
                            status: 'active',
                            updatedAt: new Date()
                        }
                    });
                });
                results.push(result);
            } catch (err) {
                errors.push({ email: empData.email, error: err.message });
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                createdCount: results.length,
                errorCount: errors.length,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getEmployeeMe = async (req, res, next) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: { userId: req.user.id },
            include: { user: true },
        });

        if (!employee) {
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const [tasksCompleted, trainingsCompleted, answersCompleted, lastAnswers] = await Promise.all([
            prisma.task.count({ where: { employeeId: employee.id, status: { in: ['DONE', 'completed'] } } }),
            prisma.trainingAssignment.count({ where: { employeeId: employee.id, status: 'COMPLETED' } }),
            prisma.answer.count({ where: { employeeId: employee.id } }),
            prisma.answer.findMany({
                where: { employeeId: employee.id },
                orderBy: { createdAt: 'desc' },
                select: { createdAt: true }
            })
        ]);

        // Calculate streak
        let streak = 0;
        if (lastAnswers.length > 0) {
            const days = new Set(lastAnswers.map(a => new Date(a.createdAt).toDateString()));
            const sortedDays = Array.from(days).map(d => new Date(d)).sort((a, b) => b - a);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let current = today;
            if (sortedDays[0].toDateString() === today.toDateString()) {
                // Participated today or yesterday
            } else {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                if (sortedDays[0].toDateString() === yesterday.toDateString()) {
                    current = yesterday;
                } else {
                    // Streak broken (not today or yesterday)
                    current = null;
                }
            }

            if (current) {
                for (let i = 0; i < sortedDays.length; i++) {
                    if (sortedDays[i].toDateString() === current.toDateString()) {
                        streak++;
                        current.setDate(current.getDate() - 1);
                    } else {
                        break;
                    }
                }
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                employee: {
                    ...employee,
                    stats: {
                        tasksCompleted,
                        trainingsCompleted,
                        answersCompleted,
                        streak
                    }
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const { name, phone, bio } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(bio && { bio }),
                ...(req.body.avatar && { avatar: req.body.avatar }),
                updatedAt: new Date()
            }
        });

        // Update Employee personality if provided


        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    bio: updatedUser.bio,
                    avatar: updatedUser.avatar
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.passwordHash !== oldPassword) {
            return res.status(400).json({ status: 'error', message: 'كلمة المرور القديمة غير صحيحة' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: newPassword,
                updatedAt: new Date()
            }
        });

        res.status(200).json({ status: 'success', message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
        next(error);
    }
};

export const getEmployeeTasks = async (req, res, next) => {
    try {
        const identifier = req.params.userId;
        const { status } = req.query;
        console.log(`[DEBUG] getEmployeeTasks called for identifier: ${identifier}, status: ${status}`);

        const employee = await prisma.employee.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { userId: identifier }
                ]
            }
        });

        if (!employee) {
            console.warn(`[DEBUG] getEmployeeTasks: Employee not found for identifier: ${identifier}`);
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const where = { employeeId: employee.id };
        if (status && status !== 'all') {
            if (status === 'TODO') {
                where.status = { in: ['pending', 'todo', 'in_progress', 'starting'] };
            } else {
                where.status = status;
            }
        }

        const tasks = await prisma.task.findMany({
            where,
            include: { project: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Parse attachments if they are stored as JSON strings
        const formattedTasks = tasks.map(t => ({
            ...t,
            attachments: typeof t.attachments === 'string' ? JSON.parse(t.attachments || '[]') : (t.attachments || [])
        }));

        res.status(200).json({ status: 'success', data: { tasks: formattedTasks } });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const identifier = req.params.userId;
        const employee = await prisma.employee.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { userId: identifier }
                ]
            }
        });

        if (!employee) {
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : undefined,
                employeeId: employee.id,
                status: 'pending',
                updatedAt: new Date()
            }
        });

        // Trigger notification
        await createNotification({
            employeeId: employee.id,
            title: 'مهمة جديدة',
            message: `تم تعيين مهمة جديدة لك: "${title}"`,
            type: 'task',
            priority: (priority || 'MEDIUM').toLowerCase(),
            metadata: { taskId: task.id }
        });

        res.status(201).json({ status: 'success', data: { task } });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;
        const { status, progress, actualTime, ...otherData } = req.body;

        const oldTask = await prisma.task.findUnique({
            where: { id: taskId },
            include: { project: true }
        });

        if (!oldTask) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }

        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...otherData,
                ...(status && { status }),
                ...(progress !== undefined && { progress: parseInt(progress) }),
                ...(actualTime !== undefined && { actualTime: parseFloat(actualTime) }),
                updatedAt: new Date()
            },
            include: {
                employee: { include: { user: { select: { name: true } } } },
                project: { select: { id: true, name: true, managerId: true } }
            }
        });

        // Notify manager if status changed
        if (status && status !== oldTask.status && task.project?.managerId) {
            let statusAr = (status === 'in_progress' || status === 'starting') ? 'بدأ العمل على' : (status === 'done' || status === 'completed') ? 'أكمل' : status;

            await createNotification({
                employeeId: task.project.managerId,
                title: 'تحديث حالة مهمة',
                message: `قام ${task.employee?.user?.name || 'موظف'} بتحديث حالة المهمة "${task.title}" إلى: ${statusAr}`,
                type: 'task',
                priority: 'low',
                metadata: { taskId: task.id, projectId: task.project.id, status }
            });
        }

        res.status(200).json({ status: 'success', data: { task } });
    } catch (error) {
        next(error);
    }
};

export const completeTask = async (req, res, next) => {
    try {
        const { taskId } = req.params;

        // Fetch task with employee and project info for the notification
        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: 'completed',
                progress: 100,
                updatedAt: new Date()
            },
            include: {
                employee: { include: { user: { select: { name: true } } } },
                project: { select: { id: true, name: true, managerId: true } }
            }
        });

        // Notify project manager if assigned
        if (task.project?.managerId) {
            await createNotification({
                employeeId: task.project.managerId,
                title: 'اكتملت مهمة',
                message: `قام ${task.employee?.user?.name || 'موظف'} بإكمال المهمة: "${task.title}" ${task.project ? `في مشروع "${task.project.name}"` : ''}`,
                type: 'task',
                priority: 'medium',
                metadata: { taskId: task.id, projectId: task.project.id, completedBy: task.employeeId }
            });
        }

        res.status(200).json({ status: 'success', data: { task } });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const { taskId, userId } = req.params;
        console.log(`[DEBUG] deleteTask controller called for TaskID: ${taskId}, UserID: ${userId}`);

        const employee = await prisma.employee.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { userId: userId }
                ]
            }
        });

        if (!employee) {
            console.warn(`[DEBUG] Employee not found for identifier: ${userId}`);
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                employeeId: employee.id
            }
        });

        if (!task) {
            console.warn(`[DEBUG] Task not found: ${taskId} for employee: ${employee.id}`);
            return res.status(404).json({ status: 'error', message: 'Task not found or does not belong to this employee' });
        }

        await prisma.task.delete({ where: { id: taskId } });
        console.log(`[DEBUG] Task deleted successfully: ${taskId}`);

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        console.error(`[DEBUG] deleteTask error:`, error);
        next(error);
    }
};

export const getEmployeePerformance = async (req, res, next) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: req.params.userId ? { userId: req.params.userId } : { userId: req.user.id },
        });
        res.status(200).json({
            status: 'success',
            data: {
                performance: {
                    score: employee?.performanceScore || 0,
                    riskLevel: employee?.riskLevel || 0,
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getDailyQuestion = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.user.id;
        const employee = await prisma.employee.findUnique({
            where: { userId },
            include: { company: true }
        });

        if (!employee) {
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch up to 3 latest questions for the company
        const questions = await prisma.dailyQuestion.findMany({
            where: { companyId: employee.companyId },
            orderBy: { createdAt: 'desc' },
            take: 3
        });

        if (questions.length === 0) {
            return res.status(200).json({ status: 'success', data: [] });
        }

        // Check which ones are answered today
        const results = await Promise.all(questions.map(async (q) => {
            const answer = await prisma.answer.findFirst({
                where: {
                    questionId: q.id,
                    employeeId: employee.id,
                    createdAt: { gte: today }
                }
            });

            return {
                ...q,
                answeredAt: answer?.createdAt || null,
                answer: answer?.content || null
            };
        }));

        // In 30x3, we usually want to return the whole set to the PWA
        // The PWA will then decide which one to show first
        res.status(200).json({ status: 'success', data: results });
    } catch (error) {
        next(error);
    }
};

export const answerDailyQuestion = async (req, res, next) => {
    try {
        const { answer } = req.body;
        const { userId, questionId } = req.params;

        const employee = await prisma.employee.findUnique({ where: { userId } });

        const result = await prisma.answer.create({
            data: {
                content: String(answer),
                questionId,
                employeeId: employee.id,
            },
        });

        res.status(201).json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
};

export const getEmployeeTrainings = async (req, res, next) => {
    try {
        const employee = await prisma.employee.findUnique({ where: { userId: req.params.userId } });

        const trainings = await prisma.trainingAssignment.findMany({
            where: { employeeId: employee.id },
            include: { course: true },
            orderBy: { assignedAt: 'desc' }
        });

        res.status(200).json({ status: 'success', data: { trainings } });
    } catch (error) {
        next(error);
    }
};

export const startTraining = async (req, res, next) => {
    try {
        const { trainingId } = req.params;

        // trainingId here is the Assignment ID
        const assignment = await prisma.trainingAssignment.update({
            where: { id: trainingId },
            data: {
                status: 'IN_PROGRESS',
                startedAt: new Date(),
                progress: 10
            }
        });
        res.status(200).json({ status: 'success', data: assignment });
    } catch (error) {
        next(error);
    }
};

export const completeTraining = async (req, res, next) => {
    try {
        const { trainingId } = req.params;

        // trainingId here is the Assignment ID
        const assignment = await prisma.trainingAssignment.update({
            where: { id: trainingId },
            data: {
                status: 'COMPLETED',
                progress: 100,
                completedAt: new Date()
            },
        });
        res.status(200).json({ status: 'success', data: assignment });
    } catch (error) {
        next(error);
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, department, position, status, riskLevel, performanceScore } = req.body;
        const companyId = req.user.companyId;

        console.log(`[DEBUG] updateEmployee called for ID: ${id}, Body:`, req.body);

        const employee = await prisma.employee.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!employee || employee.companyId !== companyId) {
            console.warn(`[DEBUG] Employee not found or unauthorized. ID: ${id}, CompanyId: ${companyId}`);
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Update User fields if provided
            if (name !== undefined || email !== undefined) {
                console.log(`[DEBUG] Updating user for employee ${id}`);
                await tx.user.update({
                    where: { id: employee.userId },
                    data: {
                        ...(name !== undefined && { name }),
                        ...(email !== undefined && { email }),
                        updatedAt: new Date()
                    }
                });
            }

            // Update Employee fields
            console.log(`[DEBUG] Updating employee record ${id}`);
            return await tx.employee.update({
                where: { id },
                data: {
                    ...(department !== undefined && { department }),
                    ...(position !== undefined && { position }),
                    ...(status !== undefined && { status }),
                    ...(riskLevel !== undefined && { riskLevel: riskLevel === null ? 0 : parseFloat(riskLevel) }),
                    ...(performanceScore !== undefined && { performanceScore: performanceScore === null ? 0 : parseFloat(performanceScore) }),
                    updatedAt: new Date()
                },
                include: { user: true }
            });
        });

        console.log(`[DEBUG] Update successful for employee ${id}`);
        res.status(200).json({ status: 'success', data: result });
    } catch (error) {
        console.error(`[DEBUG] Update failed for employee ${id}:`, error);
        next(error);
    }
};

export const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const employee = await prisma.employee.findUnique({
            where: { id }
        });

        if (!employee || employee.companyId !== companyId) {
            return res.status(404).json({ status: 'error', message: 'Employee not found' });
        }

        await prisma.$transaction(async (tx) => {
            await tx.task.deleteMany({ where: { employeeId: id } });
            await tx.trainingAssignment.deleteMany({ where: { employeeId: id } });
            await tx.answer.deleteMany({ where: { employeeId: id } });
            await tx.employee.delete({ where: { id } });
            await tx.user.delete({ where: { id: employee.userId } });
        });

        res.status(200).json({ status: 'success', message: 'Employee deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getNotifications = async (req, res, next) => {
    try {
        const identifier = req.params.id;
        console.log(`[DEBUG_NOTIFICATION] Fetching for identifier: ${identifier}`);

        const employee = await prisma.employee.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { userId: identifier }
                ]
            }
        });

        if (!employee) {
            console.warn(`[DEBUG_NOTIFICATION] Employee not found for identifier: ${identifier}`);
            return res.status(200).json({ status: 'success', data: { notifications: [] } });
        }

        const notifications = await prisma.notification.findMany({
            where: { employeeId: employee.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        console.log(`[DEBUG_NOTIFICATION] Found ${notifications.length} notifications for employee ${employee.id}`);

        const formattedNotifications = notifications.map(notif => ({
            id: notif.id,
            type: (notif.type || 'info').toLowerCase(),
            title: notif.title,
            message: notif.message,
            time: notif.createdAt.toISOString(),
            read: notif.isRead,
            priority: (notif.priority || 'medium').toLowerCase(),
            metadata: typeof notif.metadata === 'string' ? JSON.parse(notif.metadata || '{}') : (notif.metadata || {})
        }));

        res.status(200).json({
            status: 'success',
            data: {
                notifications: formattedNotifications,
                // Fallback for some service versions
                data: formattedNotifications
            },
            // Direct array fallback
            notifications: formattedNotifications
        });
    } catch (error) {
        console.error('[DEBUG_NOTIFICATION] Error:', error);
        next(error);
    }
};
