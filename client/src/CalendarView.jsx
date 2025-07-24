import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

const CalendarView = ({ tasks, isDarkMode }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());

    // Find tasks for the selected date
    const tasksForSelectedDate = tasks.filter(task => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        return isSameDay(due, selectedDate);
    });

    // Highlight days with tasks
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const hasTask = tasks.some(task => {
                if (!task.dueDate) return false;
                return isSameDay(new Date(task.dueDate), date);
            });
            return hasTask ? 'calendar-has-task' : null;
        }
        return null;
    };

    // Today button handler
    const handleToday = () => {
        const today = new Date();
        setSelectedDate(today);
        setActiveStartDate(today);
    };

    return (
        <div className={`calendar-view${isDarkMode ? ' dark' : ''}`}
            style={{ padding: 24, minHeight: 400 }}>
            <button
                onClick={handleToday}
                className="calendar-today-btn"
                style={{
                    marginBottom: 16,
                    alignSelf: 'flex-end',
                    background: isDarkMode ? '#fff' : '#111',
                    color: isDarkMode ? '#111' : '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 18px',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    transition: 'background 0.15s, color 0.15s',
                }}
                aria-label="Go to today"
            >
                Today
            </button>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            />
            <div style={{ marginTop: 24 }}>
                <h3>Tasks for {selectedDate.toLocaleDateString()}:</h3>
                {tasksForSelectedDate.length === 0 ? (
                    <div>No tasks for this day.</div>
                ) : (
                    <ul>
                        {tasksForSelectedDate.map(task => (
                            <li key={task._id || task.id}>
                                <strong>{task.title}</strong> {task.status && `(${task.status})`}
                                {task.description && <div style={{ fontSize: 13 }}>{task.description}</div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CalendarView; 