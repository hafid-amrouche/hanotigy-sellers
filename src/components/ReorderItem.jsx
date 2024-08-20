import { Reorder, useMotionValue } from "framer-motion";
import useRaisedShadow from "hooks/useRaisedShadow";

export const ReorderItem = ({ item, children, keyExtractor='id' }) => {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    return (
      <Reorder.Item
        value={item}
        id={item[keyExtractor]}
        style={{ boxShadow, y }}
      >
        {children }
      </Reorder.Item>
    );
};