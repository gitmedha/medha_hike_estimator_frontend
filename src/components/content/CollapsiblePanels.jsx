import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const CollapsiblePanels = ({
  title,
  badge,
  children,
  opened = false,
  type = "default",
  titleContent = null,
  id = '',
}) => {
  const [isOpen, setOpen] = useState(opened);

  const clicked = (e) => {
    if (!isOpen) {
      const mainContent = document.getElementById('main-content');
      setTimeout(() => { mainContent.scroll(mainContent.scrollLeft, mainContent.scrollTop + 200) }, 100);
    }
    return type === "default" ? setOpen(!isOpen) : null;
  }

  return (
    <section className="no-border p-2" id={id}>
      <div
        className="section-header d-flex justify-content-between px-2"
        onClick={clicked}
      >
        <div className="flex-row-centered">
          {titleContent ? (
            titleContent
          ) : (
            <h1 className="bebas-thick text--primary mr-3">{title}</h1>
          )}
          {badge !== undefined && (
            <div className="section-badge flex-row-centered">{badge}</div>
          )}
        </div>
        {type === "default" && (
          <button
            className="section-toggle"
            onClick={() => (type === "default" ? setOpen(!isOpen) : null)}
          >
            {isOpen ? (
              <FaChevronUp size={18} style={{ color: "#207B69" }} />
            ) : (
              <FaChevronDown size={18} style={{ color: "#207B69" }} />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.5 }}
            className="section-body"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

CollapsiblePanels.propTypes = {
  opened: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default CollapsiblePanels;
