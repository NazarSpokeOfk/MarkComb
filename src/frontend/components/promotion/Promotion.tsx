import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { useTranslation } from "react-i18next";

import { motion, AnimatePresence } from "framer-motion";

import Analytics from "./components/analytics/Analytics";
import PromotionInner from "./components/promotionInner/PromotionInner";

import { CommonTypes } from "../../types/types";

import "./Promotion.css";

const Promotion = ({ userData }: CommonTypes) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerVariants = {
    initial: { opacity: 0, y: 200 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
    exit: { opacity: 0, y: 800, transition: { duration: 0.6 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0, y: 40, transition: { duration: 0.5 } },
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Promotion")}</title>
          <meta
            name="description"
            content="Here you can see how the content maker's video has progressed"
          />
        </Helmet>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={() => setIsAnimating(false)}
          >
            {page === 0 && (
              <motion.div
                key="promotion-inner"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onAnimationComplete={() => setIsAnimating(false)}
              >
                <motion.div variants={itemVariants}>
                  <PromotionInner
                    userData={userData}
                    isAnimating={isAnimating}
                    setIsAnimating={setIsAnimating}
                    setPage={setPage}
                  />
                </motion.div>
              </motion.div>
            )}

            {page === 1 && (
              <motion.div
                key="analytics"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onAnimationComplete={() => setIsAnimating(false)}
              >
                <motion.div variants={itemVariants}>
                  <Analytics page={page} setPage={setPage} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </HelmetProvider>
    </>
  );
};

export default Promotion;
