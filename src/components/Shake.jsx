import React from 'react';
import { motion } from 'framer-motion';

const ShakeComponent = ({ shake, children }) => {
  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, -10, 10, -10, 0],
    transition: { duration: 1 }
  };

  return (
    <motion.div animate={shake ? shakeAnimation : {}} className={ shake ? 'error' : undefined}>
      {children}
    </motion.div>
  );
};

export default ShakeComponent;
