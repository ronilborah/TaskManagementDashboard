import React, { useState } from "react";
import { toast } from "react-toastify";

export const PASTEL_COLORS = [
    '#A5B4FC', '#C7D2FE', '#E0E7FF', '#6EE7B7', '#A7F3D0',
    '#FBCFE8', '#F9A8D4', '#F472B6', '#FBBF24', '#FDE68A',
    '#F87171', '#FCA5A5', '#FECACA', '#818CF8', '#A78BFA'
];

function ProjectList({
    projects,
    selectedProjectId,
    setSelectedProjectId,
    onAddProject,
    onUpdateProject,
    onDeleteProject,
    isSidebarVisible,
    isSidebarPinned,
    setIsSidebarPinned,
    onSidebarMouseLeave,
}) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", description: "", color: PASTEL_COLORS[0] });
    const [editId, setEditId] = useState(null);
    const [projectSearch, setProjectSearch] = useState("");
    const [showProjectSearch, setShowProjectSearch] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Project name is required.");
            return;
        }

        if (editId) {
            await onUpdateProject(editId, form);
        } else {
            await onAddProject(form);
        }

        setEditId(null);
        setForm({ name: "", description: "", color: PASTEL_COLORS[0] });
        setShowForm(false);
    };

    const handleEdit = (project) => {
        setForm(project);
        setEditId(project._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        onDeleteProject(id);
    };

    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(projectSearch.toLowerCase())
    );

    const isCollapsed = !isSidebarPinned;

    return (
        <aside
            className={`project-sidebar ${isSidebarVisible ? "visible" : ""} ${isSidebarPinned ? "pinned" : "collapsed"}`}
            onMouseLeave={!isSidebarPinned ? onSidebarMouseLeave : undefined}
        >
            <div className="sidebar-content">
                <div className="sidebar-header">
                    {!isCollapsed && (
                        <div className="project-search-container">
                            {showProjectSearch ? (
                                <input
                                    className="project-search-input"
                                    placeholder="Search projects..."
                                    value={projectSearch}
                                    onChange={(e) => setProjectSearch(e.target.value)}
                                    onBlur={() => setShowProjectSearch(false)}
                                    autoFocus
                                />
                            ) : (
                                <button
                                    className="sidebar-action-btn"
                                    onClick={() => setShowProjectSearch(true)}
                                    aria-label="Search projects"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <h2 style={{ display: isCollapsed ? "none" : undefined }}>Projects</h2>
                <ul>
                    {filteredProjects.map((project) => (
                        <li
                            key={project._id}
                            className={selectedProjectId === project._id ? "active" : ""}
                            style={{
                                '--project-color': project.color,
                                borderLeft: isCollapsed ? "none" : `4px solid var(--project-color)`,
                            }}
                        >
                            <span
                                className={`project-dot ${isCollapsed ? "clickable" : ""}`}
                                style={{ background: project.color }}
                                title={project.name}
                                onClick={() => setSelectedProjectId(project._id)}
                            />
                            {!isCollapsed && (
                                <>
                                    <button
                                        className="project-select-btn"
                                        onClick={() => setSelectedProjectId(project._id)}
                                        aria-label={`Select project ${project.name}`}
                                    >
                                        {project.name}
                                    </button>
                                    <button
                                        className="sidebar-edit-btn"
                                        onClick={() => handleEdit(project)}
                                        aria-label="Edit project"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="sidebar-delete-btn"
                                        onClick={() => handleDelete(project._id)}
                                        aria-label="Delete project"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                {!isCollapsed && (
                    <button
                        className="add-project-btn"
                        onClick={() => {
                            setShowForm(true);
                            setEditId(null);
                            setForm({ name: "", description: "", color: PASTEL_COLORS[0] });
                        }}
                    >
                        + Add Project
                    </button>
                )}
                {showForm && !isCollapsed && (
                    <form className="project-form" onSubmit={handleSubmit}>
                        <input
                            name="name"
                            placeholder="Project Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                        <input
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                        />
                        <div className="color-picker-container">
                            <label>Choose Color:</label>
                            <div className="color-options">
                                {PASTEL_COLORS.map((color, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`color-option ${form.color === color ? "selected" : ""}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setForm({ ...form, color: color })}
                                        title={`Color ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <button type="submit">{editId ? "Update" : "Add"}</button>
                        <button type="button" onClick={() => setShowForm(false)}>
                            Cancel
                        </button>
                    </form>
                )}
            </div>
            <div className="sidebar-footer">
                <button
                    className="sidebar-toggle-btn"
                    onClick={() => setIsSidebarPinned((c) => !c)}
                    aria-label={isSidebarPinned ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isSidebarPinned ? "<" : ">"}
                </button>
            </div>
        </aside>
    );
}

export default ProjectList;
