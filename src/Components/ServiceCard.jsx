import React from "react";

function ServiceCard({ icon, heading, desc }) {
  return (
    <>
      <div className="service-card">
        {icon}
        <br />
        <br />
        <h3 className="over-sub-heading blue">{heading}</h3>
        <br />
        <div>{desc}</div>
      </div>
    </>
  );
}

export default ServiceCard;
