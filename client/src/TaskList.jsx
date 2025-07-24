import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import FuzzyText from './FuzzyText.jsx';
import "./App.css";

const PRIORITIES = [
    { label: "High", color: "priority-high", fuzzy: { color: '#e11d48', baseIntensity: 0.2, hoverIntensity: 0.5 } },
    { label: "Medium", color: "priority-medium", fuzzy: { color: '#eab308', baseIntensity: 0.2, hoverIntensity: 0.5 } },
    { label: "Low", color: "priority-low", fuzzy: { color: '#0891b2', baseIntensity: 0.2, hoverIntensity: 0.5 } },
];

const STATUSES = [
    { label: "To Do", color: "status-todo", fuzzy: { color: '#a5b4fc', baseIntensity: 0.2, hoverIntensity: 0.5 } },
    { label: "In Progress", color: "status-inprogress", fuzzy: { color: '#fde047', baseIntensity: 0.2, hoverIntensity: 0.5 } },
    { label: "Done", color: "status-done", fuzzy: { color: '#67e8f9', baseIntensity: 0.2, hoverIntensity: 0.5 } },
];

function getCounts(tasks) {
    const completed = tasks.filter((t) => t.status === "Done").length;
    const pending = tasks.filter((t) => t.status !== "Done").length;
    const overdue = tasks.filter(
        (t) =>
            t.dueDate &&
            t.status !== "Done" &&
            new Date(t.dueDate) < new Date(new Date().toDateString())
    ).length;
    return { completed, pending, overdue };
}

function TaskList({
    tasks,
    projects,
    selectedProjectId,
    handleEdit,
    handleDelete,
    handleStatusUpdate,
    onDragEnd,
    editId,
    form,
    setForm,
    handleSubmit,
    handleChange,
    setEditId,
    setShowAddTaskForm,
    glitchOnHover = true,
    columnMode,
    setColumnMode,
}) {
    const onInternalDragEnd = (result) => {
        if (!result.destination) return;
        onDragEnd(result);
    };

    const handleComplete = (task) => {
        const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
        handleStatusUpdate(task, newStatus);
    }

    // Columns and grouping logic
    const columns = columnMode === "priority" ? PRIORITIES : STATUSES;
    const byColumn = columns.reduce((acc, col) => {
        acc[col.label] = tasks.filter(
            (t) =>
                (columnMode === "priority" ? t.priority : t.status) === col.label
        );
        return acc;
    }, {});

    // Counts
    const { overdue } = getCounts(tasks);
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;

    if (!selectedProjectId) {
        return (
            <div className="dashboard-main">
                <div className="empty-state" style={{ marginTop: '2rem' }}>
                    <div>No project selected</div>
                    <div className="empty-hint">
                        Please select a project from the sidebar to see tasks.
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                <section className="counts-row hide-on-mobile">
                    <div className="count-box plain-text-btn">
                        <div className="count">{completedTasks}</div>
                        <div className="count-label plain-text-btn">Completed</div>
                    </div>
                    <div className="count-box plain-text-btn">
                        <div className="count">{totalTasks - completedTasks}</div>
                        <div className="count-label plain-text-btn">Pending</div>
                    </div>
                    <div className="count-box plain-text-btn">
                        <div className="count">{overdue}</div>
                        <div className="count-label plain-text-btn">Overdue</div>
                    </div>
                </section>

                {/* TOGGLE BUTTON */}
                <div style={{ textAlign: "left", margin: "20px 0" }}>
                    <button
                        className="toggle-columns-btn plain-text-btn"
                        onClick={() =>
                            setColumnMode((m) => (m === "priority" ? "status" : "priority"))
                        }
                    >
                        View by: {columnMode === "priority" ? "Status" : "Priority"}
                    </button>
                </div>

                <DragDropContext onDragEnd={onInternalDragEnd}>
                    <div className="priority-columns">
                        {columns.map((col, i) => (
                            <Droppable droppableId={String(i)} key={col.label}>
                                {(provided) => (
                                    <div
                                        className={`priority-column ${col.color || ""}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="priority-header">
                                            <FuzzyText
                                                fontSize="4rem"
                                                fontWeight={700}
                                                color={col.fuzzy.color}
                                                baseIntensity={0.08}
                                                hoverIntensity={0.18}
                                                enableHover={glitchOnHover}
                                            >
                                                {col.label}
                                            </FuzzyText>
                                            <span className="priority-count">
                                                {byColumn[col.label].length}
                                            </span>
                                        </div>
                                        <div className="priority-tasks">
                                            {byColumn[col.label].length === 0 ? (
                                                <div className="empty-state">
                                                    <div>No tasks yet</div>
                                                </div>
                                            ) : (
                                                byColumn[col.label].map((task, idx) => (
                                                    <Draggable
                                                        draggableId={task._id}
                                                        index={idx}
                                                        key={task._id}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <TaskCard
                                                                    task={task}
                                                                    onDelete={handleDelete}
                                                                    onEdit={handleEdit}
                                                                    onComplete={handleComplete}
                                                                    isEditing={editId === task._id}
                                                                    form={form}
                                                                    setForm={setForm}
                                                                    handleSubmit={handleSubmit}
                                                                    handleChange={handleChange}
                                                                    setEditId={setEditId}
                                                                    setShowAddTaskForm={setShowAddTaskForm}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}

const TaskCard = ({
    task,
    onDelete,
    onEdit,
    onComplete,
    isEditing,
    form,
    setForm,
    handleSubmit,
    handleChange,
    setEditId,
    setShowAddTaskForm,
}) => (
    <>
        <div
            className={`task-card ${task.status === "Done" ? "completed" : ""} priority-${task.priority?.toLowerCase()}`}
            tabIndex="0"
        >
            <div className="task-title">{task.title}</div>
            {task.description && <p className="task-body">{task.description}</p>}
            <div className="task-meta">
                <span>Priority: {task.priority}</span>
                <span>Status: {task.status}</span>
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                {task.assignee && <span>To: {task.assignee}</span>}
            </div>
            <div className="task-actions">
                <button
                    onClick={() => onComplete(task)}
                    className="complete-btn"
                    aria-label="Complete task"
                >
                    &#10003;
                </button>
                <button
                    onClick={() => onEdit(task)}
                    className="edit-btn"
                    aria-label="Edit task"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(task._id)}
                    className="delete-btn"
                    aria-label="Delete task"
                >
                    Delete
                </button>
            </div>
        </div>
        {isEditing && (
            <form className="add-task-form" onSubmit={handleSubmit} style={{ marginTop: '0', marginBottom: '1rem' }}>
                <input
                    name="title"
                    placeholder="Task Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    name="description"
                    placeholder="Task Description"
                    value={form.description}
                    onChange={handleChange}
                />
                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                >
                    {PRIORITIES.map((p) => (
                        <option key={p.label}>{p.label}</option>
                    ))}
                </select>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                >
                    {STATUSES.map((s) => (
                        <option key={s.label}>{s.label}</option>
                    ))}
                </select>
                <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                />
                <input
                    name="assignee"
                    placeholder="Assignee"
                    value={form.assignee}
                    onChange={handleChange}
                />
                <button type="submit" className="add-btn">Update Task</button>
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                        setEditId(null);
                        setShowAddTaskForm(false);
                    }}
                >
                    Cancel
                </button>
            </form>
        )}
    </>
);

export default TaskList;
export { TaskCard };
