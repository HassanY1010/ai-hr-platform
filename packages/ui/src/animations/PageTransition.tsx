import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {children}
    </motion.div>
);
