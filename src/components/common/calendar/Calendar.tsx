import React, { useState } from "react";
import dayjs from "dayjs";
import type { Appointment } from "../../../types/AppointmentType";

interface CalendarProps {
  appointments: Appointment[];
  onDateClick: (date: dayjs.Dayjs) => void;
}

const Calendar: React.FC<CalendarProps> = ({ appointments, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startOfWeek = startOfMonth.startOf("week");
  const endOfWeek = endOfMonth.endOf("week");

  const days = [];
  let day = startOfWeek;

  while (day.isBefore(endOfWeek, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const handleDateClick = (date: dayjs.Dayjs) => {
    onDateClick(date);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
        >
          Previous
        </button>
        <span>{currentDate.format("MMMM YYYY")}</span>
        <button onClick={() => setCurrentDate(currentDate.add(1, "month"))}>
          Next
        </button>
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const dayAppointments = appointments.filter((app) =>
            dayjs(app.appointment_date).isSame(day, "day")
          );
          return (
            <div
              key={day.toString()}
              className={`calendar-day md:pt-10 min-h-16 max-h-16 md:min-h-24 ${
                dayAppointments.length > 0 ? "has-appointments" : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              <div className="text-xs md:text-base mb-0 font-bold ">
                {day.date()}
              </div>
              {dayAppointments.slice(0, 2).map((app, index) => (
                <>
                  <div key={index} className="appointment-card  hidden md:flex">
                    <p className="appointment-time">
                      {dayjs(app.appointment_date).format("h:mm A")}
                    </p>
                    <p className="appointment-reason text-white">{app.reason}</p>
                  </div>
                  <div key={index} className="appointment-card mt-0.5 pl-0.5 pr-0.5 text-white flex md:hidden">
                    <p className="appointment-reason max-w-12">
                        {app.reason.slice(0, 9)}
                    </p>
                    {dayAppointments.length > 2 && (
                      <p className="appointment-reason bg-gray-200 text-teal p-l-0.5 rounded-sm mt-0.5 max-w-12">more...</p>
                    )}
                  </div>
                </>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
