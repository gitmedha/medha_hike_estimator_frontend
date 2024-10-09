import { useState } from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Accordian = ({ children, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="accrodian-card">
      <div className="card-header d-flex justify-content-between align-items-center bg-white no-border latto-bold">
        <h4>{title}</h4>
        <button className="accrodian-btn" onClick={() => setOpen(!open)}>
          {open ? (
            <FontAwesomeIcon
              className="accrodian-icon"
              icon={["fas", "chevron-up"]}
            />
          ) : (
            <FontAwesomeIcon
              className="accrodian-icon"
              icon={["fas", "chevron-down"]}
            />
          )}
        </button>
      </div>
      {open && <Card.Body>{children}</Card.Body>}
    </Card>
  );
};

export default Accordian;
