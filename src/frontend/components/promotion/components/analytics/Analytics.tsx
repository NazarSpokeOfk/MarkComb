import { motion } from "framer-motion";

import { useState } from "react";
import { AnalyticsProps } from "../../../../types/types";

import TopPart from "./components/topPart/TopPart";
import BottomPart from "./components/bottomPart/BottomPart";

import PromotionsFunctions from "../../functions/PromotionFunctions";

import "./Analytics.css";
const containerVariants = {
  initial: { opacity: 0, y: 200 }, 
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.1 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const Analytics = ({ containerToHide, containerToShow }: AnalyticsProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={itemVariants}>
        <TopPart
          containerToHide={containerToHide}
          containerToShow={containerToShow}
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
        />
      </motion.div>

      <BottomPart />
    </motion.div>
  );
};

export default Analytics;
