import React from "react";


function Date({ date, setDate }) {
  return (
    <div>
      <DateCalendar disablePast loading />
    </div>
  );
}

export default Date;
