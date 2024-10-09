import React from "react";
import PropTypes from "prop-types";

const InfoCards = ({ type, title, value, caption, icon }) => {
  return (
    <div className="card no-border bg-light">
      <div className="card-body d-felx flex-column">
        <div className="d-flex justify-content-between mb-2">
          <p className={`text--${type} latto-regular`}>{title}</p>
          {icon && <div className={`icon-container bg--${type}`}>{icon}</div>}
        </div>
        <div className="d-flex justify-content-between">
          <h2 className={`text--${type} latto-bold`}>{value}</h2>
          {caption && (
            <p className={`info-card-caption text--${type}`}>{caption}</p>
          )}
        </div>
      </div>
    </div>
  );
};

InfoCards.propTypes = {
  caption: PropTypes.string,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default InfoCards;
