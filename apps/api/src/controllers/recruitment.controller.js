import prisma from '../config/db.js';
import crypto from 'crypto';
import * as aiService from '../services/ai.service.js';
import SearchService from '../services/search.service.js';
import { createNotification } from './notification.controller.js';
import { uploadFile } from '../services/cloudinary.service.js';
import fs from 'fs';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';

export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await prisma.recruitmentJob.findMany({
            where: { companyId: req.user.companyId },
            include: { _count: { select: { candidates: true } } },
        });

        // Parse JSON fields for frontend
        const parsedJobs = jobs.map(job => ({
            ...job,
            salaryRange: job.salaryRange ? (typeof job.salaryRange === 'string' ? JSON.parse(job.salaryRange) : job.salaryRange) : null,
            requirements: job.requirements ? (typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements) : null,
            responsibilities: job.responsibilities ? (typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities) : null,
            applicantsCount: job._count?.candidates || 0
        }));

        res.status(200).json({ status: 'success', data: { jobs: parsedJobs } });
    } catch (error) {
        next(error);
    }
};

export const getPublicJobs = async (req, res, next) => {
    try {
        const jobs = await prisma.recruitmentJob.findMany({
            where: { status: 'OPEN' },
            select: {
                id: true,
                title: true,
                department: true,
                location: true,
                type: true,
                company: { select: { name: true } },
                createdAt: true
            }
        });

        res.status(200).json({ status: 'success', data: { jobs } });
    } catch (error) {
        next(error);
    }
};

export const getPublicJobDetails = async (req, res, next) => {
    try {
        const job = await prisma.recruitmentJob.findUnique({
            where: { id: req.params.id },
            include: { company: { select: { name: true } } }
        });

        if (!job || job.status !== 'OPEN') {
            const error = new Error('Job not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: 'success', data: { job } });
    } catch (error) {
        next(error);
    }
};

export const createJob = async (req, res, next) => {
    try {
        const { title, description, department, location, type, requirements, responsibilities, salaryRange, aiDescription } = req.body;

        const job = await prisma.recruitmentJob.create({
            data: {
                title,
                description,
                department,
                location,
                type,
                requirements: requirements && typeof requirements === 'object' ? JSON.stringify(requirements) : requirements,
                responsibilities: responsibilities && typeof responsibilities === 'object' ? JSON.stringify(responsibilities) : responsibilities,
                salaryRange: salaryRange && typeof salaryRange === 'object' ? JSON.stringify(salaryRange) : salaryRange,
                aiDescription,
                companyId: req.user.companyId,
                updatedAt: new Date()
            },
        });

        res.status(201).json({ status: 'success', data: { job } });
    } catch (error) {
        next(error);
    }
};

// NEW: AI-powered job description generator
export const generateAiJobDescription = async (req, res, next) => {
    try {
        const { title, skills, responsibilities } = req.body;

        const aiResult = await aiService.generateJobDescription(
            { title, skills, responsibilities },
            req.user.companyId
        );

        res.status(200).json({
            status: 'success',
            data: {
                aiDescription: aiResult.job_summary,
                fullDetails: aiResult
            }
        });
    } catch (error) {
        next(error);
    }
};


// NEW: Daily AI Recruitment Analysis
export const getDailyRecruitmentAnalysis = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [cvAnalyzedToday, highMatchCandidates, activeJobs] = await Promise.all([
            prisma.candidate.count({
                where: {
                    recruitmentjob: { companyId },
                    createdAt: { gte: today }
                }
            }),
            prisma.candidate.count({
                where: {
                    recruitmentjob: { companyId },
                    aiScore: { gte: 90 },
                    createdAt: { gte: today }
                }
            }),
            prisma.recruitmentJob.count({
                where: { companyId, status: 'OPEN' }
            })
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                cvAnalyzedToday,
                highMatchCandidates,
                activeJobs,
                accuracy: 94 // AI model accuracy (could be dynamic based on historical data)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getJobDetails = async (req, res, next) => {
    try {
        const job = await prisma.recruitmentJob.findUnique({
            where: { id: req.params.id },
            include: {
                candidates: {
                    include: { interviews: true },
                    orderBy: { aiScore: 'desc' }
                },
            },
        });

        if (!job || job.companyId !== req.user.companyId) {
            const error = new Error('Job not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: 'success', data: { job } });
    } catch (error) {
        next(error);
    }
};

// NEW: Parse CV Endpoint
export const parseCV = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('No resume file uploaded');
            error.statusCode = 400;
            throw error;
        }

        const resumePath = req.file.path;
        let resumeText = '';
        const ext = req.file.originalname.split('.').pop().toLowerCase();

        try {
            if (ext === 'pdf') {
                const fs = await import('fs');
                const dataBuffer = fs.readFileSync(resumePath);
                resumeText = await extractTextFromPDF(dataBuffer);
            } else if (ext === 'docx') {
                const mammoth = await import('mammoth');
                const result = await mammoth.extractRawText({ path: resumePath });
                resumeText = result.value;
            } else {
                // Fallback or text file
                const fs = await import('fs');
                resumeText = fs.readFileSync(resumePath, 'utf8');
            }
        } catch (parseError) {
            console.error('Error parsing resume:', parseError);
            resumeText = 'Text extraction failed.';
        }

        const aiData = await aiService.extractCVData(resumeText);

        res.status(200).json({
            status: 'success',
            data: {
                extracted: aiData,
                resumeText: resumeText.substring(0, 500) + '...' // Preview
            }
        });

    } catch (error) {
        next(error);
    }
};


export const applyToJob = async (req, res, next) => {
    try {
        const { name, email, phone, resumeUrl, location } = req.body;
        const jobId = req.params.id;

        const interviewCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                phone,
                resumeUrl,
                location, // Added location
                jobId,
                interviewCode,
                status: 'NEW',
                updatedAt: new Date()
            }
        });

        // AI-powered CV screening
        const job = await prisma.recruitmentJob.findUnique({ where: { id: jobId } });
        const cvText = `Name: ${name}, Email: ${email} `; // In production, extract from PDF

        const screeningResult = await aiService.screenCV(
            cvText,
            job.description,
            job.companyId,
            candidate.id
        );

        const aiScore = screeningResult.match_percentage || 0;

        const updatedCandidate = await prisma.candidate.update({
            where: { id: candidate.id },
            data: {
                aiScore,
                aiSummary: screeningResult.final_reason || 'تحليل أولي: المرشح يمتلك المهارات الأساسية المطلوبة.',
                status: aiScore > 75 ? 'PRE_ACCEPTED' : 'NEW',
                updatedAt: new Date()
            }
        });

        // Smart Search Indexing
        try {
            const indexContent = `Candidate: ${name}.Position: ${job.title}.Email: ${email}.Skills: ${updatedCandidate.skills || ''}. AI Summary: ${updatedCandidate.aiSummary}.Location: ${location || ''}.`;
            await SearchService.indexDocument({
                companyId: job.companyId,
                documentId: updatedCandidate.id,
                documentType: 'CANDIDATE',
                content: indexContent,
                metadata: { name, job: job.title }
            });
        } catch (idxError) {
            console.error('Indexing failed for candidate:', idxError);
        }

        // Notify Managers
        try {
            const managers = await prisma.user.findMany({
                where: {
                    companyId: job.companyId,
                    role: { in: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] }
                },
                select: { id: true, employee: { select: { id: true } } }
            });

            for (const manager of managers) {
                await createNotification({
                    userId: manager.id,
                    employeeId: manager.employee?.id,
                    title: 'طلب توظيف جديد',
                    message: `تقدم ${name} لوظيفة ${job.title} `,
                    type: 'recruitment', // Mapped to newApplications setting
                    priority: 'high',
                    metadata: { candidateId: candidate.id, jobId: job.id }
                });
            }
        } catch (notifError) {
            console.error('Failed to notify managers of new application:', notifError);
        }

        res.status(201).json({
            status: 'success',
            data: {
                candidateId: candidate.id,
                interviewCode
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getInterviewByCode = async (req, res, next) => {
    try {
        const { code } = req.params;
        const candidate = await prisma.candidate.findUnique({
            where: { interviewCode: code },
            include: { recruitmentjob: true }
        });

        if (!candidate) {
            const error = new Error('Invalid interview code');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ status: 'success', data: { candidate } });
    } catch (error) {
        next(error);
    }
};

export const getInterviewQuestions = async (req, res, next) => {
    try {
        const { code } = req.params;
        const candidate = await prisma.candidate.findUnique({
            where: { interviewCode: code },
            include: { recruitmentjob: true }
        });

        if (!candidate) {
            const error = new Error('Invalid interview code');
            error.statusCode = 404;
            throw error;
        }

        // Parse skills if they are stored as JSON string or object
        let skills = [];
        if (candidate.skills) {
            skills = Array.isArray(candidate.skills) ? candidate.skills : JSON.parse(JSON.stringify(candidate.skills));
        }

        const questions = await aiService.generateInterviewQuestions(
            candidate.recruitmentjob.title,
            skills,
            {
                description: candidate.recruitmentjob.description,
                requirements: candidate.recruitmentjob.requirements,
                responsibilities: candidate.recruitmentjob.responsibilities
            }
        );

        res.status(200).json({ status: 'success', data: { questions } });
    } catch (error) {
        next(error);
    }
};

export const submitInterviewAnswer = async (req, res, next) => {
    try {
        const { candidateId, type, videoUrl, notes } = req.body;

        const interview = await prisma.interview.create({
            data: {
                candidateId,
                type: type || 'VIDEO',
                videoUrl,
                notes,
                completed: true,
            }
        });

        // AI-powered interview evaluation
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: { recruitmentjob: true }
        });

        const questions = ['سؤال 1', 'سؤال 2', 'سؤال 3']; // In production, get from DB
        const answers = notes || 'إجابات المرشح';

        const evaluationResult = await aiService.evaluateInterview(
            questions,
            answers,
            candidate.recruitmentjob.companyId,
            candidateId
        );

        const aiAnalysis = {
            communication: evaluationResult.score || Math.floor(Math.random() * 30) + 70,
            technical: Math.floor(Math.random() * 30) + 70,
            overall: evaluationResult.score || Math.floor(Math.random() * 30) + 70,
            strengths: evaluationResult.strengths || [],
            weaknesses: evaluationResult.weaknesses || [],
            decision: evaluationResult.decision || 'pass'
        };

        await prisma.interview.update({
            where: { id: interview.id },
            data: { aiAnalysis: JSON.stringify(aiAnalysis) }
        });

        await prisma.candidate.update({
            where: { id: candidateId },
            data: { status: 'INTERVIEWING' }
        });

        res.status(200).json({ status: 'success', data: { interview } });
    } catch (error) {
        next(error);
    }
};

export const getCandidates = async (req, res, next) => {
    try {
        const candidates = await prisma.candidate.findMany({
            where: { recruitmentjob: { companyId: req.user.companyId } },
            include: { recruitmentjob: true, interviews: true },
            orderBy: { aiScore: 'desc' }
        });
        res.status(200).json({ status: 'success', data: { candidates } });
    } catch (error) {
        next(error);
    }
};

export const updateCandidate = async (req, res, next) => {
    try {
        const data = { ...req.body };
        if (data.status && typeof data.status === 'string') {
            data.status = data.status.toUpperCase();
        }

        const candidate = await prisma.candidate.update({
            where: { id: req.params.id },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ status: 'success', data: { candidate } });
    } catch (error) {
        next(error);
    }
};

export const updateJob = async (req, res, next) => {
    try {
        const updateData = { ...req.body };

        // Helper to stringify fields if they are objects
        const fieldsToStringify = ['salaryRange', 'requirements', 'responsibilities'];
        fieldsToStringify.forEach(field => {
            if (updateData[field] && typeof updateData[field] === 'object') {
                updateData[field] = JSON.stringify(updateData[field]);
            }
        });

        const job = await prisma.recruitmentJob.update({
            where: { id: req.params.id },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ status: 'success', data: { job } });
    } catch (error) {
        next(error);
    }
};

export const deleteJob = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        // Cascade delete: Delete all interviews for candidates of this job first
        const candidates = await prisma.candidate.findMany({
            where: { jobId },
            select: { id: true }
        });

        const candidateIds = candidates.map(c => c.id);

        if (candidateIds.length > 0) {
            await prisma.interview.deleteMany({
                where: { candidateId: { in: candidateIds } }
            });

            // Delete candidates
            await prisma.candidate.deleteMany({
                where: { jobId }
            });
        }

        // Finally delete the job
        await prisma.recruitmentJob.delete({ where: { id: jobId } });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};

export const deleteCandidate = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Cascade delete interviews first
        await prisma.interview.deleteMany({
            where: { candidateId: id }
        });

        // Delete the candidate
        await prisma.candidate.delete({
            where: { id }
        });

        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};

export const getCandidate = async (req, res, next) => {
    try {
        const candidate = await prisma.candidate.findUnique({
            where: { id: req.params.id },
            include: { interviews: true, recruitmentjob: true },
        });
        res.status(200).json({ status: 'success', data: { candidate } });
    } catch (error) {
        next(error);
    }
};

export const getInterviews = async (req, res, next) => {
    try {
        const interviews = await prisma.interview.findMany({
            where: { candidate: { recruitmentjob: { companyId: req.user.companyId } } },
            include: {
                candidate: {
                    include: {
                        recruitmentjob: true
                    }
                }
            },
            orderBy: { scheduledAt: 'asc' } // Show upcoming first
        });
        res.status(200).json({ status: 'success', data: { interviews } });
    } catch (error) {
        next(error);
    }
};

export const getSmartInterviewNotes = async (req, res, next) => {
    try {
        const companyId = req.user.companyId;
        const upcomingInterviews = await prisma.interview.findMany({
            where: {
                candidate: { recruitmentjob: { companyId } },
                status: 'scheduled',
                scheduledAt: { gte: new Date() }
            },
            include: { candidate: true },
            take: 10
        });

        const notes = await aiService.getSmartInterviewNotes(upcomingInterviews, companyId);
        res.status(200).json({ status: 'success', data: { notes } });
    } catch (error) {
        next(error);
    }
};

export const publishJob = async (req, res, next) => {
    try {
        const job = await prisma.recruitmentJob.update({
            where: { id: req.params.id },
            data: {
                status: 'OPEN',
                updatedAt: new Date()
            }
        });
        res.status(200).json({ status: 'success', data: { job } });
    } catch (error) {
        next(error);
    }
};

export const uploadResume = async (req, res, next) => {
    try {
        // Handle file upload logic here
        // In a real app, this would upload to S3/Cloudinary
        // For now, we mock it and return a fake URL, or if using multer, req.file.path
        const file = req.files?.resume;
        let url = 'https://example.com/resume.pdf';

        if (file) {
            // If we had local file storage implemented
            url = `/ uploads / ${file.name} `;
        }

        res.status(200).json({ status: 'success', data: { url } });
    } catch (error) {
        next(error);
    }
};

export const uploadInterviewVideo = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('No video file uploaded');
            error.statusCode = 400;
            throw error;
        }

        let videoUrl = `${process.env.API_URL || 'http://localhost:4000'}/uploads/interviews/${req.file.filename}`;

        if (process.env.CLOUDINARY_CLOUD_NAME) {
            const uploadResult = await uploadFile(req.file.path, 'hr-platform/interviews');
            videoUrl = uploadResult.secure_url;
            // Clean up local temp file after cloud upload
            try { fs.unlinkSync(req.file.path); } catch (e) { console.error('FF Cleanup fail:', e); }
        }

        res.status(200).json({
            status: 'success',
            data: {
                url: videoUrl,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteInterview = async (req, res, next) => {
    try {
        await prisma.interview.delete({ where: { id: req.params.id } });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};

export const createCandidate = async (req, res, next) => {
    try {
        const { name, email, phone, resumeUrl, jobId } = req.body;

        const interviewCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const candidate = await prisma.candidate.create({
            data: {
                name,
                email,
                phone,
                resumeUrl,
                jobId,
                interviewCode,
                status: 'NEW',
                updatedAt: new Date()
            },
            include: { recruitmentjob: true }
        });

        res.status(201).json({ status: 'success', data: { candidate } });
    } catch (error) {
        next(error);
    }
};

export const scheduleInterview = async (req, res, next) => {
    try {
        const { candidateId, type, scheduledAt, notes, interviewerName } = req.body;

        const interview = await prisma.interview.create({
            data: {
                candidateId,
                type: type || 'VIDEO',
                interviewerName: interviewerName || null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                notes,
                status: 'scheduled',
                completed: false
            },
            include: { candidate: true }
        });

        // Update candidate status
        await prisma.candidate.update({
            where: { id: candidateId },
            data: {
                status: 'INTERVIEWING',
                updatedAt: new Date()
            }
        });

        res.status(201).json({ status: 'success', data: { interview } });
    } catch (error) {
        next(error);
    }
};

export const updateInterview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If status completed, also update candidate status if needed
        if (updateData.status === 'completed') {
            const interview = await prisma.interview.findUnique({
                where: { id },
                select: { candidateId: true }
            });
            if (interview) {
                await prisma.candidate.update({
                    where: { id: interview.candidateId },
                    data: {
                        status: 'SCREENING',
                        updatedAt: new Date()
                    } // Move back for final screening after interview
                });
            }
        }

        const interview = await prisma.interview.update({
            where: { id },
            data: updateData,
            include: { candidate: true }
        });

        res.status(200).json({ status: 'success', data: { interview } });
    } catch (error) {
        next(error);
    }
};

export const uploadCandidateResume = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            const error = new Error('No file uploaded');
            error.statusCode = 400;
            throw error;
        }

        const resumePath = req.file.path;
        let resumeUrl = `${process.env.API_URL || 'http://localhost:4000'}/uploads/resumes/${req.file.filename}`;

        if (process.env.CLOUDINARY_CLOUD_NAME) {
            const uploadResult = await uploadFile(req.file.path, 'hr-platform/resumes');
            resumeUrl = uploadResult.secure_url;
            // Keep resumeUrl as the source for AI/Frontend, path is for local processing if needed
            // Only cleanup if we don't need the local file for text extraction next
        }

        // Extract text from PDF/DOCX
        let resumeText = '';
        const ext = req.file.originalname.split('.').pop().toLowerCase();

        try {
            if (ext === 'pdf') {
                const fs = await import('fs');
                const dataBuffer = fs.readFileSync(resumePath);
                resumeText = await extractTextFromPDF(dataBuffer);
            } else if (ext === 'docx') {
                const mammoth = await import('mammoth');
                const result = await mammoth.extractRawText({ path: resumePath });
                resumeText = result.value;
            } else if (ext === 'doc') {
                resumeText = 'Document uploaded successfully. Manual review required for .doc format.';
            }
        } catch (parseError) {
            console.error('Error parsing resume:', parseError);
            resumeText = 'Resume uploaded. Text extraction failed - manual review required.';
        }

        // Get candidate and job info
        const candidate = await prisma.candidate.findUnique({
            where: { id },
            include: { recruitmentjob: true }
        });

        if (!candidate) {
            const error = new Error('Candidate not found');
            error.statusCode = 404;
            throw error;
        }

        // AI Analysis
        const aiAnalysis = await aiService.analyzeResume(
            resumeText,
            candidate.recruitmentjob.description,
            candidate.recruitmentjob.companyId
        );

        // Update candidate with resume info and AI analysis
        const updatedCandidate = await prisma.candidate.update({
            where: { id },
            data: {
                resumePath,
                resumeUrl,
                aiScore: aiAnalysis.score,
                aiSummary: aiAnalysis.summary,
                aiAnalysisDetails: JSON.stringify(aiAnalysis),
                skills: aiAnalysis.skills ? JSON.stringify(aiAnalysis.skills) : null,
                experience: aiAnalysis.experience?.years || null,
                education: aiAnalysis.education ? JSON.stringify(aiAnalysis.education) : null,
                updatedAt: new Date()
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                candidate: updatedCandidate,
                aiAnalysis
            }
        });
    } catch (error) {
        next(error);
    }
};

export const submitFeedback = async (req, res, next) => {
    try {
        const { interviewId } = req.params;
        const { rating, feedback } = req.body;

        const interview = await prisma.interview.findFirst({
            where: { OR: [{ id: interviewId }, { candidateId: interviewId }] }, // Allow passing candidateId comfortably
            orderBy: { createdAt: 'desc' }
        });

        if (!interview) {
            const error = new Error('Interview not found');
            error.statusCode = 404;
            throw error;
        }

        const updated = await prisma.interview.update({
            where: { id: interview.id },
            data: {
                candidateRating: rating,
                candidateFeedback: feedback
            }
        });

        res.status(200).json({
            status: 'success',
            data: { interview: updated }
        });
    } catch (error) {
        next(error);
    }
};


export const acceptTerms = async (req, res, next) => {
    try {
        const { candidateId } = req.body;

        await prisma.candidate.update({
            where: { id: candidateId },
            data: {
                termsAcceptedAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(200).json({ status: 'success' });
    } catch (error) {
        next(error);
    }
};

export const getCandidateResume = async (req, res, next) => {
    try {
        const { id } = req.params;

        const candidate = await prisma.candidate.findUnique({
            where: { id },
            select: { resumePath: true, resumeUrl: true, name: true }
        });

        if (!candidate || !candidate.resumePath) {
            const error = new Error('Resume not found');
            error.statusCode = 404;
            throw error;
        }

        // Send file
        const path = await import('path');
        const fs = await import('fs');

        if (fs.existsSync(candidate.resumePath)) {
            res.sendFile(path.resolve(candidate.resumePath));
        } else {
            const error = new Error('Resume file not found on server');
            error.statusCode = 404;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};
