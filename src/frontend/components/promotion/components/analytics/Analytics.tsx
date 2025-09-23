import "./Analytics.css";
import TopPart from "./components/topPart/TopPart";
import BottomPart from "./components/bottomPart/BottomPart";

import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { AnalyticsProps } from "../../../../types/types";

const containerVariants = {
  initial: { opacity: 0, y: 200 }, // выезжает снизу
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: 800, transition: { duration: 0.6 } }, // падает вниз
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.35 } },
};

const Analytics = ({ page, setPage }: AnalyticsProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <motion.div variants={itemVariants}>
            <TopPart
              isAnimating={isAnimating}
              setIsAnimating={setIsAnimating}
              setPage={setPage}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <BottomPart />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Analytics;
