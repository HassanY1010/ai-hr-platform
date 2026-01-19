import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../../uploads');
const resumesDir = path.join(uploadsDir, 'resumes');
const videosDir = path.join(uploadsDir, 'interviews');
const attachmentsDir = path.join(uploadsDir, 'attachments');

[uploadsDir, resumesDir, videosDir, attachmentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration for resumes
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, resumesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `resume-${uniqueSuffix}${ext}`);
    }
});

// Storage configuration for videos
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videosDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname) || '.mp4';
        cb(null, `interview-${uniqueSuffix}${ext}`);
    }
});

// Storage configuration for general attachments
const attachmentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, attachmentsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `attachment-${uniqueSuffix}${ext}`);
    }
});

// File filter for resumes (PDF, DOC, DOCX)
const resumeFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
    }
};

// File filter for videos (MP4, WebM)
const videoFileFilter = (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/webm', 'video/x-matroska'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only MP4 and WebM videos are allowed.'), false);
    }
};

// Multer instances
export const uploadResume = multer({
    storage: resumeStorage,
    fileFilter: resumeFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).single('resume');

export const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
}).single('video');

export const uploadAttachment = multer({
    storage: attachmentStorage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit
    }
}).single('file');
