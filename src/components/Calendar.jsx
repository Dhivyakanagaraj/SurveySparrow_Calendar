import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import './Calendar.css';
import dayjs from 'dayjs';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetch('/events.json')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const handlePrev = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const handleNext = () => setCurrentDate(currentDate.add(1, 'month'));
  const handleToday = () => setCurrentDate(dayjs());
  const handleDayClick = (day) => setSelectedDay(day);
  const handleChangeDate = (newDate) => setCurrentDate(newDate);

  const eventsForDay = selectedDay
    ? events.filter(ev => dayjs(ev.date).isSame(selectedDay, 'day'))
    : [];

  const monthEvents = events.filter(ev =>
    dayjs(ev.date).isSame(currentDate, 'month')
  );

  function getEventCategory(title) {
    const lower = title.toLowerCase();
    if (lower.includes('meeting')) return 'Meeting';
    if (lower.includes('call')) return 'Call';
    if (lower.includes('webinar')) return 'Webinar';
    if (lower.includes('reminder')) return 'Reminder';
    if (lower.includes('interview')) return 'Interview';
    return '';
  }

  const groupedEvents = monthEvents.reduce((acc, ev) => {
    const category = getEventCategory(ev.title);
    if (!acc[category]) acc[category] = [];
    acc[category].push(ev);
    return acc;
  }, {});

  
  function hasTimeConflicts(events) {
    const timeMap = {};
    for (const ev of events) {
      if (timeMap[ev.time]) return true;
      timeMap[ev.time] = true;
    }
    return false;
  }

  function isConflicting(event, allEvents) {
    return allEvents.filter(ev => ev.time === event.time).length > 1;
  }

  return (
    <div className="calendar-container">
      
      <div className="left-event-sidebar">
        <h2>Monthly Events</h2>

        {Object.keys(groupedEvents).length === 0 ? (
          <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>
            No events scheduled this month.
          </p>
        ) : (
          Object.keys(groupedEvents).map((category) => (
            <div key={category} className="event-category">
              <h4>{category}</h4>
              <ul>
                {groupedEvents[category].map((ev, i) => (
                  <li key={i}>
                    <strong>{ev.title}</strong><br />
                    {dayjs(ev.date).format('DD MMM YYYY')}<br />
                    {ev.time} • {ev.duration}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      
      <div className="main-layout">
        <CalendarHeader
          date={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onChangeDate={handleChangeDate}
        />

        <CalendarGrid
          date={currentDate}
          events={events}
          onDayClick={handleDayClick}
          selectedDay={selectedDay}
        />
      </div>

      
      {selectedDay && (
        <>
          <div className="modal-backdrop" onClick={() => setSelectedDay(null)}></div>
          <div className="calendar-modal">
            <button className="modal-close-btn" onClick={() => setSelectedDay(null)}>×</button>
            <h2>{selectedDay.format('DD MMMM YYYY')}</h2>

            {eventsForDay.length === 0 ? (
              <p>No events scheduled for this day.</p>
            ) : (
              <>
                {hasTimeConflicts(eventsForDay) && (
                  <div className="conflict-warning">
                    ⚠ Conflict: Multiple events are scheduled at the same time.
                  </div>
                )}

                <ul>
                  {eventsForDay.map((ev, i) => (
                    <li key={i} className={isConflicting(ev, eventsForDay) ? 'conflict-event' : ''}>
                      <strong>{ev.title}</strong><br />
                      Time: {ev.time}<br />
                      Duration: {ev.duration}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Calendar;
