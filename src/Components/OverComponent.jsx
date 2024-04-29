import React from "react";
import { Link } from "react-router-dom";

function OverComponent({ heading, subHeading, btn, link }) {
  return (
    <div className="page-form overSection">
      <h1 className="over-heading">{heading}</h1>
      <div className="bar"></div>
      <br />
      {subHeading && (
        <>
          <span className="over-sub-heading">{subHeading}</span>
          <br />
        </>
      )}
      {btn && <Link to={link} >
        <button className="input-btn btn" >{btn}</button>
      </Link>}
    </div>
  );
}

export default OverComponent;
