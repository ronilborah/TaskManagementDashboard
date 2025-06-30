import React from "react";
import "./App.css";
import { TaskCard } from "./TaskList";

export default function TaskGridView({
    tasks,
    handleEdit,
    handleDelete,
    handleStatusUpdate,
    editId,
    form,
    setForm,
    handleSubmit,
    handleChange,
    setEditId,
    setShowAddTaskForm,
    selectedProjectId,
    projects,
}) {
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
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-main">
                <div className="task-grid-view">
                    {tasks.length === 0 ? (
                        <div className="empty-state">
                            <div>No tasks yet</div>
                        </div>
                    ) : (
                        <div className="task-grid">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    onComplete={(task) => handleStatusUpdate(task, task.status === 'Done' ? 'To Do' : 'Done')}
                                    isEditing={editId === task._id}
                                    form={form}
                                    setForm={setForm}
                                    handleSubmit={handleSubmit}
                                    handleChange={handleChange}
                                    setEditId={setEditId}
                                    setShowAddTaskForm={setShowAddTaskForm}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 