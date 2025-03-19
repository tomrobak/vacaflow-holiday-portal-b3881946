
import React from "react";

const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap gap-3 mt-6 px-2 text-xs">
      <div className="calendar-legend-item">
        <span className="calendar-legend-dot bg-primary"></span>
        <span>Selected</span>
      </div>
      <div className="calendar-legend-item">
        <span className="calendar-legend-dot bg-red-300"></span>
        <span>Unavailable</span>
      </div>
      <div className="calendar-legend-item">
        <span className="calendar-legend-dot bg-primary/15"></span>
        <span>Selected range</span>
      </div>
      <div className="calendar-legend-item">
        <span className="calendar-legend-dot border border-accent"></span>
        <span>Today</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
