import { motion } from 'framer-motion';

export const SlideIn = ({ children }: { children: React.ReactNode }) => (
    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        {children}
    </motion.div>
);
