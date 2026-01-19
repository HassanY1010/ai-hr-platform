import app from './app.js';
import { startDeadlineChecker } from './jobs/deadlineChecker.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    startDeadlineChecker();
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
