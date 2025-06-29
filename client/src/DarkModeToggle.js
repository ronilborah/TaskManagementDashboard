import React from "react";

export default function DarkModeToggle({ isDarkMode, setIsDarkMode }) {
    return (
        <button
            className="dark-toggle"
            onClick={() => setIsDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
        >
            {isDarkMode ? "Dark" : "Light"}
        </button>
    );
}
