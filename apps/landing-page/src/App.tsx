import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import LandingPage from './pages/LandingPage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import InterviewPage from './pages/InterviewPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import AboutUs from './pages/AboutUs'
import SuccessStories from './pages/SuccessStories'

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center font-bold text-indigo-600">جاري التحميل...</div>}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:id" element={<JobDetailsPage />} />
                    <Route path="/interview/:code" element={<InterviewPage />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/success-stories" element={<SuccessStories />} />
                </Routes>
            </Suspense>
            <Toaster position="top-center" richColors />
        </Router>
    )
}

export default App
