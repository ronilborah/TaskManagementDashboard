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

    return (
        <div className={`calendar-view${isDarkMode ? ' dark' : ''}`}
            style={{ padding: 24, minHeight: 400 }}>
            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
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