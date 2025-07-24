import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import ProjectList from "./ProjectList.jsx";
import TaskList, { TaskCard } from "./TaskList.jsx";
import { toast } from "react-toastify";
import api from "./api";
import ParticlesBackground from './ParticlesBackground.jsx';
import { DragDropContext } from '@hello-pangea/dnd';
import Threads from './Threads.jsx';
import { StaticDock } from "./Dock.jsx";
import { VscFilter, VscAdd, VscColorMode, VscSymbolColor, VscSearch, VscLayout, VscCalendar } from "react-icons/vsc";
import CalendarView from "./CalendarView.jsx";

const PRIORITIES = [
    { label: "High", value: 3 },
    { label: "Medium", value: 2 },
    { label: "Low", value: 1 },
];

const STATUSES = [
    { label: "To Do", value: "todo" },
    { label: "In Progress", value: "in-progress" },
    { label: "Done", value: "done" },
];

const defaultTask = {
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
};

const defaultTaskWithRecurrence = { ...defaultTask, recurrence: 'none' };

const backgroundImages = [
    "coolbackgrounds-topography-micron.svg",
    "coolbackgrounds-fractalize-cool_backgrounds.png",
    "layered-peaks-haikei.svg",
    "stacked-peaks-haikei.svg",
    "polygon-scatter-haikei.svg",
    "layered-steps-haikei.svg",
    "low-poly-grid-haikei.svg",
    "stacked-waves-haikei.svg",
    "layered-waves-haikei.svg",
    "blob-scene-haikei.svg",
    "circle-scatter-haikei.svg"
];

function KeyboardNavigationSupport() {
    useEffect(() => {
        // Helper: Get all focusable elements
        const getFocusableElements = () =>
            Array.from(document.querySelectorAll(
                'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));

        // Skip link support (invisible, but accessible to screen readers)
        let skipLink = document.getElementById('skip-to-main-content');
        if (!skipLink) {
            skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.id = 'skip-to-main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.position = 'absolute';
            skipLink.style.left = '-999px';
            skipLink.style.top = '10px';
            skipLink.style.background = '#fff';
            skipLink.style.color = '#000';
            skipLink.style.padding = '8px 16px';
            skipLink.style.zIndex = '10000';
            skipLink.style.transition = 'left 0.2s';
            skipLink.addEventListener('focus', () => {
                skipLink.style.left = '10px';
            });
            skipLink.addEventListener('blur', () => {
                skipLink.style.left = '-999px';
            });
            document.body.prepend(skipLink);
        }

        // Ensure main content has an id for skip link
        const main = document.querySelector('main, .dashboard-main');
        if (main && !main.id) {
            main.id = 'main-content';
        }

        // Keyboard navigation for Arrow keys (for lists, nav, etc.)
        const handleKeyDown = (e) => {
            const focusable = getFocusableElements();
            const index = focusable.indexOf(document.activeElement);
            if (e.key === 'Tab') {
                // Let browser handle Tab/Shift+Tab
                return;
            }
            // Arrow navigation for lists and menus
            if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
                if (index > -1) {
                    e.preventDefault();
                    const next = focusable[(index + 1) % focusable.length];
                    next && next.focus();
                }
            } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
                if (index > -1) {
                    e.preventDefault();
                    const prev = focusable[(index - 1 + focusable.length) % focusable.length];
                    prev && prev.focus();
                }
            } else if (e.key === 'Home') {
                if (focusable.length) {
                    e.preventDefault();
                    focusable[0].focus();
                }
            } else if (e.key === 'End') {
                if (focusable.length) {
                    e.preventDefault();
                    focusable[focusable.length - 1].focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (skipLink && skipLink.parentNode) {
                skipLink.parentNode.removeChild(skipLink);
            }
        };
    }, []);

    return null;
}

function TaskGridView({
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
const recurrenceOptions = [
    { label: 'None', value: 'none' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
];

function RecurringTaskDialog({ value, onChange }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label htmlFor="recurrence-select" style={{ fontWeight: 500, marginRight: 4 }}>
                Repeat:
            </label>
            <select
                id="recurrence-select"
                className="filter-select"
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{ minWidth: 120 }}
            >
                {recurrenceOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

const Dashboard = ({
    projects, tasks, selectedProjectId, setSelectedProjectId, isSidebarHovering, setIsSidebarHovering, isSidebarPinned, setIsSidebarPinned,
    isDarkMode, setIsDarkMode, search, setSearch, filterPriority, setFilterPriority, filterStatus, setFilterStatus, filterAssignee, setFilterAssignee, filterDate, setFilterDate, sortBy, setSortBy, sortOrder, setSortOrder, showFilters, setShowFilters, showAddTaskForm, setShowAddTaskForm, form, setForm, editId, setEditId, loading, handleAddProject, handleUpdateProject, handleDeleteProject, fetchTasks, handleEdit, handleSubmit, handleDelete, handleStatusUpdate, handleDragEnd, handleChange, backgroundType, setBackgroundType, showBgModal,
    setShowBgModal, showSettings, setShowSettings, glitchOnHover, setGlitchOnHover, columnMode, setColumnMode, gridView,
    setGridView, showCalendarModal, setShowCalendarModal,
}) => {
    const isSidebarVisible = isSidebarHovering || isSidebarPinned;
    const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
    const projectsDropdownRef = useRef(null);
    const settingsRef = useRef(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    const searchInputRef = useRef(null);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showSearchModal, setShowSearchModal] = useState(false);

    // --- MOBILE STATUS COUNTS ---
    let completedTasks = 0, totalTasks = 0, overdue = 0;
    if (window.innerWidth <= 768) {
        totalTasks = tasks.length;
        completedTasks = tasks.filter(t => t.status === 'Done').length;
        overdue = tasks.filter(
            t => t.dueDate && t.status !== 'Done' && new Date(t.dueDate) < new Date(new Date().toDateString())
        ).length;
    }

    useEffect(() => {
        if (!showProjectsDropdown) return;
        function handleClick(e) {
            if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(e.target)) {
                setShowProjectsDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showProjectsDropdown]);

    // Focus search input when search is shown
    useEffect(() => {
        if (showMobileSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showMobileSearch]);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 768);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close modal on ESC
    useEffect(() => {
        if (!showSearchModal) return;
        function handleKeyDown(e) {
            if (e.key === "Escape") setShowSearchModal(false);
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [showSearchModal]);

    return (
        <div className={`app-root ${isSidebarPinned ? "sidebar-pinned" : ""}`}
            style={backgroundType !== "particles" ? {
                backgroundImage: `url(/images/backgrounds/${backgroundType})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            } : {}}>
            {backgroundType === "particles" && <ParticlesBackground isDarkMode={isDarkMode} />}
            {backgroundType === 'threads' && (
                <Threads
                    color={isDarkMode ? [1, 1, 1] : [0.1, 0.1, 0.1]}
                    amplitude={1}
                    distance={0}
                    enableMouseInteraction={true}
                    style={{ position: 'absolute', inset: 0, zIndex: 0 }}
                />
            )}
            {backgroundType !== "particles" && backgroundType !== "threads" && <div className={`background-overlay${isDarkMode ? ' dark' : ''}`}></div>}
            <div
                className="sidebar-hover-area"
                onMouseEnter={() => setIsSidebarHovering(true)}
            />
            <DragDropContext onDragEnd={handleDragEnd}>
                <ProjectList
                    projects={projects}
                    selectedProjectId={selectedProjectId}
                    setSelectedProjectId={setSelectedProjectId}
                    onAddProject={handleAddProject}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                    isSidebarVisible={isSidebarVisible}
                    isSidebarPinned={isSidebarPinned}
                    setIsSidebarPinned={setIsSidebarPinned}
                    onSidebarMouseLeave={() => setIsSidebarHovering(false)}
                />
                <div className="main-content">
                    <header className="header">
                        {/* Sidebar Toggle Button (top-left, both desktop and mobile) */}
                        <button
                            className="icon-btn sidebar-toggle-btn"
                            aria-label="Toggle Sidebar"
                            onClick={() => setIsSidebarPinned((p) => !p)}
                            type="button"
                            style={{ marginRight: 12 }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                        </button>
                        {/* Mobile Top Bar */}
                        {isMobile ? (
                            <>
                                <div className="mobile-top-bar-row">
                                    <button
                                        className="action-btn mobile-hamburger-btn"
                                        aria-label="Open Projects Menu"
                                        onClick={() => setShowProjectsDropdown((v) => !v)}
                                        type="button"
                                        style={{ marginTop: 12, marginLeft: 0 }}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                                    </button>
                                    <div style={{ flex: 1 }} />
                                    <button
                                        className="icon-btn mobile-search-btn"
                                        aria-label="Search Tasks"
                                        onClick={() => setShowMobileSearch(s => !s)}
                                        type="button"
                                        style={{ marginTop: 12, marginRight: 0 }}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                    </button>
                                </div>
                                {showMobileSearch && (
                                    <div className="search-container main-search show-mobile-search" style={{ marginTop: 8 }}>
                                        <input
                                            className="filter-input"
                                            placeholder="Search tasks..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            ref={searchInputRef}
                                            tabIndex={0}
                                        />
                                    </div>
                                )}
                                {/* Mobile status + actions row */}
                                <div className="mobile-status-actions-row">
                                    <section className="counts-row hide-on-mobile">
                                        <div
                                            className="count-box plain-text-btn"
                                            style={{ position: 'relative', overflow: 'hidden' }}
                                            onMouseEnter={() => setHoveredCard('completed')}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {hoveredCard === 'completed'}
                                            <div className="count" style={{ position: 'relative', zIndex: 1 }}>{completedTasks}</div>
                                            <div className="count-label plain-text-btn" style={{ position: 'relative', zIndex: 1 }}>Completed</div>
                                        </div>
                                        <div
                                            className="count-box plain-text-btn"
                                            style={{ position: 'relative', overflow: 'hidden' }}
                                            onMouseEnter={() => setHoveredCard('pending')}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {hoveredCard === 'pending'}
                                            <div className="count" style={{ position: 'relative', zIndex: 1 }}>{totalTasks - completedTasks}</div>
                                            <div className="count-label plain-text-btn" style={{ position: 'relative', zIndex: 1 }}>Pending</div>
                                        </div>
                                        <div
                                            className="count-box plain-text-btn"
                                            style={{ position: 'relative', overflow: 'hidden' }}
                                            onMouseEnter={() => setHoveredCard('overdue')}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            {hoveredCard === 'overdue'}
                                            <div className="count" style={{ position: 'relative', zIndex: 1 }}>{overdue}</div>
                                            <div className="count-label plain-text-btn" style={{ position: 'relative', zIndex: 1 }}>Overdue</div>
                                        </div>
                                    </section>
                                    <div className="header-actions mobile-header-actions">
                                        <button className="plain-text-btn" onClick={() => setShowFilters(s => !s)} title="Show Filters">Filter</button>
                                        <button className="plain-text-btn" onClick={() => setShowBgModal(true)} title="Change Background">Background</button>
                                        <button
                                            className="icon-btn settings-btn"
                                            aria-label="Settings"
                                            onClick={() => setShowSettings(s => !s)}
                                            type="button"
                                            style={{ marginLeft: 8 }}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.14.31.22.65.22 1v.09A1.65 1.65 0 0 0 21 12c0 .35-.08.69-.22 1z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="search-container main-search">
                                    <div style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: Search input rendered</div>
                                    <input
                                        className="filter-input"
                                        placeholder="Search tasks..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        ref={searchInputRef}
                                        tabIndex={0}
                                        style={{ border: '2px solid red' }}
                                        onClick={() => console.log('Search input clicked', searchInputRef.current)}
                                    />
                                </div>
                                <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
                                    <StaticDock
                                        items={[
                                            {
                                                icon: <VscSearch size={24} />, label: "Search", onClick: () => setShowSearchModal(true),
                                            },
                                            {
                                                icon: <VscFilter size={24} />, label: "Filter", onClick: () => {
                                                    setShowFilters((s) => !s);
                                                },
                                            },
                                            {
                                                icon: <VscAdd size={24} />, label: "Add Task", onClick: () => {
                                                    setEditId(null); setForm(defaultTaskWithRecurrence); setShowAddTaskForm((s) => !s);
                                                },
                                            },
                                            {
                                                icon: <VscCalendar size={24} />, label: "Calendar", onClick: () => setShowCalendarModal(true),
                                            },
                                            {
                                                icon: <VscColorMode size={24} />, label: isDarkMode ? "Light" : "Dark", onClick: () => {
                                                    setIsDarkMode((d) => !d);
                                                },
                                            },
                                            {
                                                icon: <VscSymbolColor size={24} />, label: "Background", onClick: () => {
                                                    setShowBgModal(true);
                                                },
                                            },
                                            {
                                                icon: <VscLayout size={24} />, label: "Grid", onClick: () => setGridView((v) => !v),
                                            },
                                        ]}
                                        panelHeight={68}
                                        baseItemSize={50}
                                    />
                                </div>
                            </>
                        )}
                    </header>

                    {showAddTaskForm && !editId && (
                        <form className="add-task-form" onSubmit={handleSubmit}>
                            <input
                                name="title"
                                placeholder="Task Title *"
                                value={form.title}
                                onChange={handleChange}
                                required
                                autoFocus
                                className={!form.title.trim() && form.title !== "" ? "error" : ""}
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
                                    <option key={p.label} value={p.label}>{p.label}</option>
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
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <RecurringTaskDialog
                                value={form.recurrence}
                                onChange={val => setForm(f => ({ ...f, recurrence: val }))}
                            />
                            <input
                                name="assignee"
                                placeholder="Assignee"
                                value={form.assignee}
                                onChange={handleChange}
                            />
                            <button type="submit" className="add-btn" disabled={loading}>
                                {loading ? "Saving..." : (editId ? "Update Task" : "Add Task")}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setShowAddTaskForm(false);
                                    setEditId(null);
                                    setForm(defaultTaskWithRecurrence);
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </form>
                    )}

                    {showFilters && (
                        <section className="filter-row">
                            <select
                                className="filter-select"
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="">All Priorities</option>
                                {PRIORITIES.map((p) => (
                                    <option key={p.label}>{p.label}</option>
                                ))}
                            </select>
                            <select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            <input
                                className="filter-input"
                                placeholder="Assignee"
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                            />
                            <input
                                className="filter-input"
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                            <select
                                className="filter-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="priority">Sort by Priority</option>
                                <option value="dueDate">Sort by Due Date</option>
                                <option value="createdAt">Sort by Creation Date</option>
                            </select>
                            <button
                                className="action-btn sort-order-btn"
                                onClick={() => setSortOrder(order => (order === 'asc' ? 'desc' : 'asc'))}
                                aria-label={`Set sort order to ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                            <button
                                className="filter-btn"
                                onClick={() => {
                                    setFilterPriority("");
                                    setFilterStatus("");
                                    setFilterAssignee("");
                                    setFilterDate("");
                                }}
                            >
                                Clear
                            </button>
                        </section>
                    )}

                    <main className="dashboard-main">
                        {gridView ? (
                            <TaskGridView
                                tasks={tasks}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleStatusUpdate={handleStatusUpdate}
                                editId={editId}
                                form={form}
                                setForm={setForm}
                                handleSubmit={handleSubmit}
                                handleChange={handleChange}
                                setEditId={setEditId}
                                setShowAddTaskForm={setShowAddTaskForm}
                                selectedProjectId={selectedProjectId}
                                projects={projects}
                            />
                        ) : (
                            <TaskList
                                tasks={tasks}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                handleStatusUpdate={handleStatusUpdate}
                                onDragEnd={handleDragEnd}
                                loading={loading}
                                projects={projects}
                                selectedProjectId={selectedProjectId}
                                fetchTasks={fetchTasks}
                                showAddTaskForm={showAddTaskForm}
                                setShowAddTaskForm={setShowAddTaskForm}
                                editId={editId}
                                setEditId={setEditId}
                                form={form}
                                setForm={setForm}
                                handleSubmit={handleSubmit}
                                handleChange={handleChange}
                                glitchOnHover={glitchOnHover}
                                columnMode={columnMode}
                                setColumnMode={setColumnMode}
                            />
                        )}
                    </main>
                </div>
            </DragDropContext>
            {showBgModal && (
                <div className="bg-modal-overlay" onClick={() => setShowBgModal(false)}>
                    <div className="bg-modal" onClick={e => e.stopPropagation()}>
                        <h3>Select Background</h3>
                        <div className="bg-options">
                            <div className="bg-option" onClick={() => { setBackgroundType("particles"); setShowBgModal(false); }} style={{ border: backgroundType === "particles" ? '2px solid #4f46e5' : '2px solid transparent' }}>
                                <div style={{ width: 80, height: 60, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, borderRadius: 8 }}>Particles</div>
                            </div>
                            {backgroundImages.map(img => (
                                <div className="bg-option" key={img} onClick={() => { setBackgroundType(img); setShowBgModal(false); }} style={{ border: backgroundType === img ? '2px solid #4f46e5' : '2px solid transparent' }}>
                                    <img src={`/images/backgrounds/${img}`} alt={img} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                                </div>
                            ))}
                            <div className="bg-option" onClick={() => { setBackgroundType("threads"); setShowBgModal(false); }} style={{ border: backgroundType === "threads" ? '2px solid #4f46e5' : '2px solid transparent' }}>
                                <div style={{ width: 80, height: 60, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, borderRadius: 8 }}>Animated Threads</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showProjectsDropdown && isMobile && (
                <div
                    className="projects-dropdown-menu"
                    ref={projectsDropdownRef}
                    style={{ position: 'absolute', top: '56px', left: 0, width: '100vw', zIndex: 300 }}
                >
                    <ProjectList
                        projects={projects}
                        selectedProjectId={selectedProjectId}
                        setSelectedProjectId={setSelectedProjectId}
                        onAddProject={handleAddProject}
                        onUpdateProject={handleUpdateProject}
                        onDeleteProject={handleDeleteProject}
                        isSidebarVisible={true}
                        isSidebarPinned={true}
                        setIsSidebarPinned={setIsSidebarPinned}
                        onSidebarMouseLeave={() => { }}
                    />
                </div>
            )}
            {showSettings && (
                <div className={`settings-panel${isDarkMode ? ' dark' : ''}`} ref={settingsRef}>
                    <div className="settings-title">Settings</div>
                    <div className="settings-row">
                        <label htmlFor="glitch-on-hover-toggle">Glitch Text on Hover Only</label>
                        <input
                            id="glitch-on-hover-toggle"
                            type="checkbox"
                            checked={glitchOnHover}
                            onChange={e => {
                                setGlitchOnHover(e.target.checked);
                                localStorage.setItem('glitchOnHover', e.target.checked);
                            }}
                        />
                    </div>
                </div>
            )}
            {/* Search Modal Overlay */}
            {showSearchModal && (
                <div
                    className="search-modal-overlay"
                    tabIndex={-1}
                    aria-modal="true"
                    role="dialog"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'transparent',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={e => {
                        if (e.target === e.currentTarget) setShowSearchModal(false);
                    }}
                >
                    <div
                        className="search-modal-content"
                        style={{
                            background: 'transparent',
                            color: isDarkMode ? '#fff' : '#111',
                            borderRadius: 12,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            padding: 32,
                            minWidth: 340,
                            maxWidth: '90vw',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            position: 'relative',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            aria-label="Close search"
                            onClick={() => setShowSearchModal(false)}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                background: 'none',
                                border: 'none',
                                color: isDarkMode ? '#fff' : '#111',
                                fontSize: 22,
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                        <label htmlFor="dock-search-input" style={{ fontWeight: 600, marginBottom: 8 }}>Search Tasks</label>
                        <input
                            id="dock-search-input"
                            className="filter-input"
                            placeholder="Type to search tasks by title or description..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            autoFocus
                            style={{ fontSize: 18, padding: 12, borderRadius: 8, border: '1px solid #ccc', marginBottom: 8 }}
                        />
                        <div style={{ fontSize: 13, color: isDarkMode ? '#aaa' : '#666' }}>
                            Press <kbd>ESC</kbd> or click outside to close
                        </div>
                    </div>
                </div>
            )}
            {/* Calendar Modal Overlay */}
            {showCalendarModal && (
                <div
                    className="search-modal-overlay"
                    tabIndex={-1}
                    aria-modal="true"
                    role="dialog"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'transparent',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={e => {
                        if (e.target === e.currentTarget) setShowCalendarModal(false);
                    }}
                >
                    <div
                        className="search-modal-content"
                        style={{
                            background: 'transparent',
                            color: isDarkMode ? '#fff' : '#111',
                            borderRadius: 12,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            padding: 32,
                            minWidth: 340,
                            maxWidth: '90vw',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            position: 'relative',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            aria-label="Close calendar"
                            onClick={() => setShowCalendarModal(false)}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                background: 'none',
                                border: 'none',
                                color: isDarkMode ? '#fff' : '#111',
                                fontSize: 22,
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                        <CalendarView tasks={tasks} isDarkMode={isDarkMode} />
                    </div>
                </div>
            )}
        </div>
    )
};

function App() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(() => {
        return localStorage.getItem("selectedProjectId") || null;
    });
    const [isSidebarHovering, setIsSidebarHovering] = useState(false);
    const [isSidebarPinned, setIsSidebarPinned] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
    const [search, setSearch] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterAssignee, setFilterAssignee] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [sortBy, setSortBy] = useState("priority");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showFilters, setShowFilters] = useState(false);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [form, setForm] = useState(defaultTaskWithRecurrence);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showBgModal, setShowBgModal] = useState(false);
    const [backgroundType, setBackgroundType] = useState(() => localStorage.getItem("backgroundType") || "particles");
    const [showSettings, setShowSettings] = useState(false);
    const [glitchOnHover, setGlitchOnHover] = useState(() => {
        const stored = localStorage.getItem('glitchOnHover');
        return stored ? stored === 'true' : true;
    });
    const [columnMode, setColumnMode] = useState("status");
    const [gridView, setGridView] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);

    // --- Project Handlers ---

    const handleAddProject = async (projectData) => {
        try {
            await api.postProject(projectData);
            toast.success('Project added successfully!');
            await fetchProjects(); // Re-fetch to get the new project with its _id
        } catch (error) {
            // Handled by interceptor
        }
    };

    const handleUpdateProject = async (projectId, projectData) => {
        try {
            await api.putProject(projectId, projectData);
            toast.success('Project updated successfully!');
            await fetchProjects();
        } catch (error) {
            // Handled by interceptor
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure? This will also delete all tasks in this project.")) {
            try {
                await api.deleteProject(projectId);
                toast.success('Project deleted successfully!');
                // After deleting, fetch projects and then tasks
                await fetchProjects();
                // The fetchTasks dependency on selectedProjectId will handle refreshing tasks
            } catch (error) {
                // Handled by interceptor
            }
        }
    };

    // --- Re-usable Data Fetching Functions ---

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.getProjects();
            const fetchedProjects = response.data.data;
            setProjects(fetchedProjects);

            if (fetchedProjects.length > 0) {
                const projectExists = fetchedProjects.some(p => p._id === selectedProjectId);
                if (!selectedProjectId || !projectExists) {
                    setSelectedProjectId(fetchedProjects[0]._id);
                }
            } else {
                setSelectedProjectId(null);
            }
        } catch (error) {
            // Handled by interceptor
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId]);

    const fetchTasks = useCallback(async () => {
        if (!selectedProjectId) {
            setTasks([]);
            return;
        }
        setLoading(true);
        try {
            const params = {
                projectId: selectedProjectId,
                priority: filterPriority,
                status: filterStatus,
                assignee: filterAssignee,
                dueDate: filterDate,
                search: search,
                sortBy: sortBy,
                sortOrder: sortOrder,
            };

            const response = await api.getTasks(params);
            setTasks(response.data.data);
        } catch (error) {
            // Handled by interceptor
        } finally {
            setLoading(false);
        }
    }, [selectedProjectId, filterPriority, filterStatus, filterAssignee, filterDate, search, sortBy, sortOrder]);

    // --- useEffect hooks for initial load and persistence ---

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        localStorage.setItem("selectedProjectId", selectedProjectId || "");
        if (isDarkMode) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [selectedProjectId, isDarkMode]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        localStorage.setItem("backgroundType", backgroundType);
    }, [backgroundType]);

    const handleEdit = (task) => {
        const formattedTask = {
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        };
        setForm(formattedTask);
        setEditId(task._id);
        setShowAddTaskForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error("Task title is required!");
            return;
        }
        setLoading(true);

        const taskData = { ...form, projectId: selectedProjectId, recurrence: form.recurrence };

        try {
            if (editId) {
                await api.putTask(editId, taskData);
                toast.success("Task updated successfully!");
            } else {
                await api.postTask(taskData);
                toast.success("Task added successfully!");
            }
            await fetchTasks(); // Re-fetch tasks to show the new/updated one
            setForm(defaultTaskWithRecurrence);
            setEditId(null);
            setShowAddTaskForm(false);
        } catch (error) {
            // Error is already handled by the interceptor
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await api.deleteTask(taskId);
                toast.success("Task deleted successfully!");
                await fetchTasks(); // Re-fetch
            } catch (error) {
                // Handled by interceptor
            }
        }
    };

    const handleStatusUpdate = async (task, newStatus) => {
        try {
            await api.putTask(task._id, { status: newStatus });
            toast.success(`Task moved to ${newStatus}`);
            await fetchTasks(); // Re-fetch
        } catch (error) {
            // Handled by interceptor
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination, source } = result;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const task = tasks.find(t => t._id === draggableId);
        if (!task) return;

        // Determine which column type is active
        let newValue;
        if (columnMode === "priority") {
            // Map destination.droppableId (index) to PRIORITIES
            const PRIORITIES = ["High", "Medium", "Low"];
            newValue = PRIORITIES[parseInt(destination.droppableId, 10)];
            if (task.priority !== newValue) {
                await api.putTask(task._id, { priority: newValue });
                toast.success(`Task moved to ${newValue} priority`);
                await fetchTasks();
            }
        } else {
            // Map destination.droppableId (index) to STATUSES
            const STATUSES = ["To Do", "In Progress", "Done"];
            newValue = STATUSES[parseInt(destination.droppableId, 10)];
            if (task.status !== newValue) {
                await api.putTask(task._id, { status: newValue });
                toast.success(`Task moved to ${newValue}`);
                await fetchTasks();
            }
        }
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <>
            <Dashboard
                projects={projects}
                tasks={tasks}
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                isSidebarHovering={isSidebarHovering}
                setIsSidebarHovering={setIsSidebarHovering}
                isSidebarPinned={isSidebarPinned}
                setIsSidebarPinned={setIsSidebarPinned}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                search={search}
                setSearch={setSearch}
                filterPriority={filterPriority}
                setFilterPriority={setFilterPriority}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterAssignee={filterAssignee}
                setFilterAssignee={setFilterAssignee}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                showAddTaskForm={showAddTaskForm}
                setShowAddTaskForm={setShowAddTaskForm}
                form={form}
                setForm={setForm}
                editId={editId}
                setEditId={setEditId}
                loading={loading}
                handleAddProject={handleAddProject}
                handleUpdateProject={handleUpdateProject}
                handleDeleteProject={handleDeleteProject}
                fetchTasks={fetchTasks}
                handleEdit={handleEdit}
                handleSubmit={handleSubmit}
                handleDelete={handleDelete}
                handleStatusUpdate={handleStatusUpdate}
                handleDragEnd={handleDragEnd}
                handleChange={handleChange}
                backgroundType={backgroundType}
                setBackgroundType={setBackgroundType}
                showBgModal={showBgModal}
                setShowBgModal={setShowBgModal}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                glitchOnHover={glitchOnHover}
                setGlitchOnHover={setGlitchOnHover}
                columnMode={columnMode}
                setColumnMode={setColumnMode}
                gridView={gridView}
                setGridView={setGridView}
                showCalendarModal={showCalendarModal}
                setShowCalendarModal={setShowCalendarModal}
            />

            <KeyboardNavigationSupport />
        </>
    );
}



export default App; 