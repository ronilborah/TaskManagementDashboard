import React from 'react';
import './DashboardAnalytics.css';

const DashboardAnalytics = ({ tasks }) => {
    // Progress Tracking
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Productivity Score
    const getProductivityScore = () => {
        if (totalTasks === 0) return 0;
        const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
        let score = completionPercentage - (overdueTasks * 10);
        return Math.max(0, Math.min(100, score));
    };
    const productivityScore = getProductivityScore();

    // Quick Insights
    const today = new Date().toDateString();
    const completedToday = tasks.filter(t => t.status === 'Done' && new Date(t.updatedAt).toDateString() === today).length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const completedThisWeek = tasks.filter(t => t.status === 'Done' && new Date(t.updatedAt) >= weekAgo).length;

    // Priority Distribution
    const highPriority = tasks.filter(t => t.priority === 'High').length;
    const mediumPriority = tasks.filter(t => t.priority === 'Medium').length;
    const lowPriority = tasks.filter(t => t.priority === 'Low').length;

    return (
        <div className="dashboard-analytics">
            <h3>Dashboard Analytics</h3>
            <div className="analytics-section">
                <h4>Progress Tracking</h4>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <span>{completionPercentage}% Complete</span>
            </div>
            <div className="analytics-section">
                <h4>Productivity Score</h4>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${productivityScore}%` }}></div>
                </div>
                <span>{productivityScore} / 100</span>
            </div>
            <div className="analytics-section">
                <h4>Quick Insights</h4>
                <div className="quick-insights">
                    <span>Today: {completedToday} tasks</span>
                    <span>This Week: {completedThisWeek} tasks</span>
                </div>
            </div>
            <div className="analytics-section">
                <h4>Priority Distribution</h4>
                <div className="priority-distribution">
                    <div className="priority-item">
                        <span>High:</span>
                        <div className="priority-bar-container">
                            <div className="priority-bar high" style={{ width: `${totalTasks > 0 ? (highPriority / totalTasks) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                    <div className="priority-item">
                        <span>Medium:</span>
                        <div className="priority-bar-container">
                            <div className="priority-bar medium" style={{ width: `${totalTasks > 0 ? (mediumPriority / totalTasks) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                    <div className="priority-item">
                        <span>Low:</span>
                        <div className="priority-bar-container">
                            <div className="priority-bar low" style={{ width: `${totalTasks > 0 ? (lowPriority / totalTasks) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAnalytics; 