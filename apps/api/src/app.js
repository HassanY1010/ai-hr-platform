import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import checkInRoutes from './routes/check-in.routes.js';
import companyRoutes from './routes/company.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import recruitmentRoutes from './routes/recruitment.routes.js';
import questionRoutes from './routes/question.routes.js';
import trainingRoutes from './routes/training.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import alertRoutes from './routes/alert.routes.js';
import managerRoutes from './routes/manager.routes.js';
import adminRoutes from './routes/admin.routes.js';
import roadmapRoutes from './routes/roadmap.routes.js';
import aiQualityRoutes from './routes/ai-quality.routes.js';
import userRoutes from './routes/user.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import subscriptionCodeRoutes from './routes/subscription-code.routes.js';
import fileRoutes from './routes/file.routes.js';
import searchRoutes from './routes/search.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { checkKillSwitch } from './middlewares/governance.middleware.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3004', 'http://localhost:3005'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Global Governance Check
app.use(checkKillSwitch);


// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'AI HR Platform API is running',
        version: '1.0.0',
        documentation: '/api/docs',
        status: 'UP',
        landingPage: process.env.LANDING_PAGE_URL || 'http://localhost:3005'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/check-in', checkInRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/trainings', trainingRoutes); // Fallback for plural if needed
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/ai-quality', aiQualityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscription-codes', subscriptionCodeRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
