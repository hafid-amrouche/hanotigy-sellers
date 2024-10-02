import { useIsPresent, motion } from 'framer-motion'

const MotionItem = ({ children, Tag=motion.div, ...props }) => {
    const isPresent = useIsPresent();
    const animations = {
      style: {
        position: isPresent ? "static" : "absolute",
      },
      // initial: { scale: 0, opacity: 0 },
      // animate: { scale: 1, opacity: 1 },
      // exit: { scale: 0, opacity: 0 },
      // transition: { type: "spring", stiffness: 0, damping: 0 }
    };

    const innerProps = {
      transition: { height: { duration: 0 } }
    }
    return (
      <Tag 
        {...animations} 
        {...props}        
        >
          {children}
      </Tag>
    );
  };

export default MotionItem;