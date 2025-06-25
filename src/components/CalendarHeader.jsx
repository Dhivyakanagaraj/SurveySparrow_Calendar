import { useState } from 'react';
import './CalendarHeader.css';
export default function CalendarHeader({ date, onPrev, onNext, onToday, onChangeDate }) {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 30 }, (_, i) => 2010 + i); 

  const handleMonthSelect = (monthIndex) => {
    onChangeDate(date.month(monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    onChangeDate(date.year(year));
    setShowYearPicker(false);
  };

  return (
    <div className="calendar-header">
      <div>
        <button onClick={onPrev} className="nav-btn" title="Previous Month">←</button>
        <button onClick={onToday} className="nav-btn btn-today" title="Go to Today">Today</button>
        <button onClick={onNext} className="nav-btn" title="Next Month">→</button>
      </div>

      <div className="month-year">
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
          >
            {months[date.month()]} <span className="arrow">▼</span>
          </button>
          {showMonthPicker && (
            <div className="dropdown-menu">
              {months.map((month, idx) => (
                <button key={month} onClick={() => handleMonthSelect(idx)}>
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        <span style={{ margin: '0 8px' }}>/</span>

        <div className="dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
          >
            {date.year()} <span className="arrow">▼</span>
          </button>
          {showYearPicker && (
            <div className="dropdown-menu">
              {years.map((year) => (
                <button key={year} onClick={() => handleYearSelect(year)}>
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
