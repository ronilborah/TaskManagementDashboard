import { useEffect } from "react";

/**
 * This component injects ARIA attributes into the DOM for accessibility,
 * without modifying any existing code or structure.
 *
 * Usage: Import and render <AriaLabelsInjector /> at the root of your app (e.g., in App.js or Main.js).
 */
export default function AriaLabelsInjector() {
    useEffect(() => {
        // Example: Add ARIA roles/labels to navigation
        const navs = document.querySelectorAll("nav");
        navs.forEach(nav => {
            nav.setAttribute("aria-label", "Main navigation");
            nav.setAttribute("role", "navigation");
        });

        // Example: Add ARIA labels to all sidebar elements
        const sidebars = document.querySelectorAll(".sidebar");
        sidebars.forEach(sb => {
            sb.setAttribute("aria-label", "Sidebar");
            sb.setAttribute("role", "complementary");
        });

        // Example: Add ARIA labels to all main content containers
        const mains = document.querySelectorAll("main, .dashboard-main");
        mains.forEach(main => {
            main.setAttribute("aria-label", "Main content");
            main.setAttribute("role", "main");
        });

        // Example: Add ARIA labels to all task lists
        const taskLists = document.querySelectorAll(".task-list, .priority-columns");
        taskLists.forEach(list => {
            list.setAttribute("aria-label", "Task list");
            list.setAttribute("role", "list");
        });

        // Example: Add ARIA labels to all project lists
        const projectLists = document.querySelectorAll(".project-list");
        projectLists.forEach(list => {
            list.setAttribute("aria-label", "Project list");
            list.setAttribute("role", "list");
        });

        // Example: Add ARIA labels to all buttons without one
        const buttons = document.querySelectorAll("button:not([aria-label])");
        buttons.forEach(btn => {
            // Try to infer a label from text content
            const text = btn.textContent.trim();
            if (text) {
                btn.setAttribute("aria-label", text);
            } else {
                btn.setAttribute("aria-label", "Button");
            }
        });

        // Example: Add ARIA labels to all forms
        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.setAttribute("aria-label", "Form");
            form.setAttribute("role", "form");
        });

        // Example: Add ARIA labels to all modals
        const modals = document.querySelectorAll("[class*='modal']");
        modals.forEach(modal => {
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("role", "dialog");
        });

        // Example: Add ARIA labels to all close buttons
        const closeBtns = document.querySelectorAll(".close, .close-btn, .unified-close-btn");
        closeBtns.forEach(btn => {
            btn.setAttribute("aria-label", "Close");
        });

        // Example: Add ARIA labels to all search inputs
        const searchInputs = document.querySelectorAll("input[type='search'], .search-input");
        searchInputs.forEach(input => {
            input.setAttribute("aria-label", "Search");
            input.setAttribute("role", "searchbox");
        });

        // Example: Add ARIA labels to all calendar widgets
        const calendars = document.querySelectorAll(".unified-calendar-wrapper, .calendar");
        calendars.forEach(cal => {
            cal.setAttribute("aria-label", "Calendar");
            cal.setAttribute("role", "region");
        });

        // Example: Add ARIA labels to all analytics panels
        const analytics = document.querySelectorAll(".dashboard-analytics");
        analytics.forEach(panel => {
            panel.setAttribute("aria-label", "Analytics panel");
            panel.setAttribute("role", "region");
        });
    }, []);

    return null;
} 