import { useEffect } from "react";

export default function KeyboardNavigationSupport() {
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