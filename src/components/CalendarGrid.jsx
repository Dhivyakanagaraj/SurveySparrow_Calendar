import React from 'react';
import dayjs from 'dayjs';
import './CalendarGrid.css';

export default function CalendarGrid({ date, events = [], onDayClick, selectedDay }) {
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');
  const startDate = startOfMonth.startOf('week'); 
  const endDate = endOfMonth.endOf('week');       

  const days = [];
  let current = startDate;

  while (current.isBefore(endDate, 'day') || current.isSame(endDate, 'day')) {
    days.push(current);
    current = current.add(1, 'day');
  }

  return (
    <div className="calendar-grid">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
        <div key={dayName} className="day-name">
          {dayName}
        </div>
      ))}

      {days.map((day) => {
        const dayEvents = events.filter(ev =>
          dayjs(ev.date).isSame(day, 'day')
        );

        const MAX_EVENTS_VISIBLE = 1;
        const visibleEvents = dayEvents.slice(0, MAX_EVENTS_VISIBLE);
        const hiddenCount = dayEvents.length - MAX_EVENTS_VISIBLE;

        const isToday = day.isSame(dayjs(), 'day');
        const isOutside = !day.isSame(date, 'month');
        const isSelected = selectedDay && day.isSame(selectedDay, 'day');

        return (
          <div
            key={day.format('YYYY-MM-DD')}
            className={`date-cell
              ${isOutside ? 'outside' : ''}
              ${isToday ? 'today' : ''}
              ${isSelected ? 'selected' : ''}`}
            onClick={() => onDayClick(day)}
          >
            <div className="date-number">{day.date()}</div>

            {visibleEvents.map((ev, i) => (
              <span key={i} className="event" title={`${ev.title} (${ev.time}, ${ev.duration})`}>
                {ev.title}
              </span>
            ))}

            {hiddenCount > 0 && (
              <button className="more-btn">
                +{hiddenCount} more
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
