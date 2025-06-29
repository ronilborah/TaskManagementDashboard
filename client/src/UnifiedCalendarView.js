import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './UnifiedCalendarView.css';
import tinycolor from 'tinycolor2';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay, isSameWeek, format } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from './api';

const UnifiedCalendarView = ({ projects, fetchAllTasks, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [taskModal, setTaskModal] = useState(null);
    const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));

    useEffect(() => {
        const loadAllTasks = async () => {
            const tasks = await fetchAllTasks();
            setAllTasks(tasks);
        };
        loadAllTasks();
    }, [fetchAllTasks]);

    const tasksByDate = useMemo(() => allTasks.reduce((acc, task) => {
        if (task.dueDate) {
            const dateKey = new Date(task.dueDate).toDateString();
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(task);
        }
        return acc;
    }, {}), [allTasks]);

    const getProjectInfo = useCallback((task) => {
        const project = projects.find(p => p._id === task.projectId);
        return {
            color: project ? (project.colorHex || project.color || '#6b7280') : '#6b7280',
            name: project ? project.name : 'Unknown Project'
        };
    }, [projects]);

    const handleDateChange = useCallback((date) => {
        setSelectedDate(date);
        const dateKey = date.toDateString();
        setTasksForSelectedDate(tasksByDate[dateKey] || []);
    }, [tasksByDate]);

    useEffect(() => {
        handleDateChange(selectedDate);
    }, [allTasks, selectedDate, handleDateChange]);

    // Update weekStart if selectedDate changes in week view
    useEffect(() => {
        if (viewMode === 'week') {
            setWeekStart(startOfWeek(selectedDate, { weekStartsOn: 0 }));
        }
    }, [selectedDate, viewMode]);

    // Helper to get days in current week
    const getWeekDays = (date) => {
        const start = startOfWeek(date, { weekStartsOn: 0 });
        return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    };

    const makeGradient = (hex) => {
        const base = tinycolor(hex).toRgbString();
        const faded = tinycolor(hex).setAlpha(0.25).toRgbString();
        return `linear-gradient(135deg, ${base} 0%, ${faded} 100%)`;
    };

    const getTaskEventStyle = (color) => {
        const gradient = makeGradient(color);
        const textColor = tinycolor(color).isLight() ? '#000' : '#fff';
        return { backgroundImage: gradient, color: textColor, border: 'none' };
    };

    // Modified tileContent for week view
    const renderTile = (date) => {
        const dateKey = date.toDateString();
        const dayTasks = tasksByDate[dateKey] || [];
        if (dayTasks.length > 0) {
            return (
                <div className="unified-tile-content">
                    {dayTasks.slice(0, 3).map(task => {
                        const { color } = getProjectInfo(task);
                        const style = getTaskEventStyle(color);
                        return (
                            <div
                                key={task._id}
                                className="unified-task-item"
                                style={{ ...style, cursor: 'pointer', maxWidth: '100%' }}
                                title={task.title}
                                onClick={e => {
                                    e.stopPropagation();
                                    setTaskModal(task);
                                }}
                            >
                                {task.title.length > 22 ? task.title.slice(0, 20) + '…' : task.title}
                            </div>
                        );
                    })}
                    {dayTasks.length > 3 && (
                        <div className="unified-more-tasks">
                            +{dayTasks.length - 3} more
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    // Drag-and-drop handler for calendar
    const onCalendarDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const task = allTasks.find(t => t._id === draggableId);
        if (!task) return;
        // destination.droppableId is the date string
        const newDate = new Date(destination.droppableId);
        if (task.dueDate && new Date(task.dueDate).toDateString() === newDate.toDateString()) return;
        try {
            await api.putTask(task._id, { ...task, dueDate: newDate });
            await fetchAllTasks();
        } catch (e) {
            // Optionally show error
        }
    };

    // Helper to render a day cell as a droppable
    const renderDroppableDay = (date, children) => (
        <Droppable droppableId={date.toDateString()} key={date.toISOString()}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`unified-calendar-weekday${isSameDay(date, selectedDate) ? ' selected' : ''}`}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: snapshot.isDraggingOver ? 'var(--primary-light)' : (isSameDay(date, selectedDate) ? 'var(--primary-light)' : 'transparent'),
                        padding: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onClick={() => handleDateChange(date)}
                >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{format(date, 'EEE d')}</div>
                    {children}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );

    // Modified tileContent for month view to support drag-and-drop
    const tileContent = useCallback(({ date, view }) => {
        if (view === 'month') {
            const dateKey = date.toDateString();
            const dayTasks = tasksByDate[dateKey] || [];
            return (
                <Droppable droppableId={dateKey} key={dateKey}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="unified-tile-content"
                            style={{ minHeight: 32, background: snapshot.isDraggingOver ? 'var(--primary-light)' : undefined, borderRadius: 6, transition: 'background 0.2s' }}
                        >
                            {dayTasks.slice(0, 3).map((task, idx) => {
                                const { color } = getProjectInfo(task);
                                const style = getTaskEventStyle(color);
                                return (
                                    <Draggable draggableId={task._id} index={idx} key={task._id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="unified-task-item"
                                                style={{ ...style, cursor: 'grab', maxWidth: '100%', marginBottom: 2, opacity: snapshot.isDragging ? 0.7 : 1, ...provided.draggableProps.style }}
                                                title={task.title}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setTaskModal(task);
                                                }}
                                            >
                                                {task.title.length > 22 ? task.title.slice(0, 20) + '…' : task.title}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {dayTasks.length > 3 && (
                                <div className="unified-more-tasks">
                                    +{dayTasks.length - 3} more
                                </div>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            );
        }
        return null;
    }, [tasksByDate, getProjectInfo]);

    const tileClassName = useCallback(({ date, view }) => {
        if (view === 'month' && tasksByDate[date.toDateString()]) {
            return 'has-tasks';
        }
        return null;
    }, [tasksByDate]);

    return (
        <div className="unified-calendar-overlay" onClick={onClose}>
            <div className="unified-calendar-modal" onClick={e => e.stopPropagation()}>
                <div className="unified-calendar-header">
                    <h2>Calendar Overview</h2>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button
                            className={`plain-text-btn${viewMode === 'month' ? ' active' : ''}`}
                            onClick={() => setViewMode('month')}
                            style={{ fontWeight: viewMode === 'month' ? 700 : 400 }}
                        >
                            Monthly View
                        </button>
                        <button
                            className={`plain-text-btn${viewMode === 'week' ? ' active' : ''}`}
                            onClick={() => setViewMode('week')}
                            style={{ fontWeight: viewMode === 'week' ? 700 : 400 }}
                        >
                            Weekly View
                        </button>
                    </div>
                    <button className="unified-close-btn" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="unified-calendar-body">
                    <div className="unified-calendar-wrapper">
                        <DragDropContext onDragEnd={onCalendarDragEnd}>
                            {viewMode === 'month' ? (
                                <Calendar
                                    onChange={handleDateChange}
                                    value={selectedDate}
                                    tileContent={tileContent}
                                    tileClassName={tileClassName}
                                />
                            ) : (
                                <div className="unified-week-view">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <button className="plain-text-btn" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>&lt;</button>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{format(weekStart, 'MMM d')} - {format(endOfWeek(weekStart, { weekStartsOn: 0 }), 'MMM d, yyyy')}</span>
                                        <button className="plain-text-btn" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>&gt;</button>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                                        {getWeekDays(weekStart).map((date) => {
                                            const dateKey = date.toDateString();
                                            const dayTasks = tasksByDate[dateKey] || [];
                                            return renderDroppableDay(date, dayTasks.slice(0, 3).map((task, idx) => {
                                                const { color } = getProjectInfo(task);
                                                const style = getTaskEventStyle(color);
                                                return (
                                                    <Draggable draggableId={task._id} index={idx} key={task._id}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="unified-task-item"
                                                                style={{ ...style, cursor: 'grab', maxWidth: '100%', marginBottom: 2, opacity: snapshot.isDragging ? 0.7 : 1, ...provided.draggableProps.style }}
                                                                title={task.title}
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    setTaskModal(task);
                                                                }}
                                                            >
                                                                {task.title.length > 22 ? task.title.slice(0, 20) + '…' : task.title}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            }));
                                        })}
                                    </div>
                                </div>
                            )}
                        </DragDropContext>
                    </div>
                    <div className="unified-tasks-sidebar">
                        <h3>Tasks for {selectedDate.toLocaleDateString()}</h3>
                        <div className="unified-tasks-list">
                            {tasksForSelectedDate.length > 0 ? (
                                tasksForSelectedDate.map(task => {
                                    const { color, name } = getProjectInfo(task);
                                    return (
                                        <div
                                            key={task._id}
                                            className="unified-task-card"
                                            style={{ borderLeftColor: color }}
                                        >
                                            <div className="unified-task-card-header">
                                                <span className="unified-task-card-title">{task.title}</span>
                                                <span className="unified-task-card-project" style={{ color }}>{name}</span>
                                            </div>
                                            <p className="unified-task-card-description">{task.description}</p>
                                            <div className="unified-task-card-footer">
                                                <span className={`unified-task-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                                                <span className={`unified-task-badge status-${task.status.toLowerCase().replace(' ', '')}`}>{task.status}</span>
                                                {task.assignee && <span className="unified-task-badge assignee">👤 {task.assignee}</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="unified-no-tasks">No tasks for this day.</p>
                            )}
                        </div>
                    </div>
                </div>
                {taskModal && (
                    <div className="unified-calendar-overlay" style={{ zIndex: 2000 }} onClick={() => setTaskModal(null)}>
                        <div className="unified-calendar-modal" style={{ maxWidth: 400, width: '90vw', padding: 0 }} onClick={e => e.stopPropagation()}>
                            <div className="unified-calendar-header" style={{ borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Task Details</h2>
                                <button className="unified-close-btn" onClick={() => setTaskModal(null)} aria-label="Close Task">×</button>
                            </div>
                            <div style={{ padding: 24 }}>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>{taskModal.title}</div>
                                <div style={{ marginBottom: 8 }}><b>Project:</b> {getProjectInfo(taskModal).name}</div>
                                <div style={{ marginBottom: 8 }}><b>Due:</b> {taskModal.dueDate ? new Date(taskModal.dueDate).toLocaleString() : '—'}</div>
                                <div style={{ marginBottom: 8 }}><b>Status:</b> {taskModal.status}</div>
                                <div style={{ marginBottom: 8 }}><b>Priority:</b> {taskModal.priority}</div>
                                <div style={{ marginBottom: 8 }}><b>Assignee:</b> {taskModal.assignee || '—'}</div>
                                <div style={{ marginBottom: 8 }}><b>Description:</b> {taskModal.description || '—'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedCalendarView; 