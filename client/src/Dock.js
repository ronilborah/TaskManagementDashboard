"use client";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import {
    Children,
    cloneElement,
    useEffect,
    useRef,
    useState,
} from "react";
import "./Dock.css";
import React from "react";

function DockItem({
    children,
    className = "",
    onClick,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
}) {
    const ref = useRef(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, (val) => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize,
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, magnification, baseItemSize]
    );
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size,
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`dock-item ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, (child) =>
                cloneElement(child, { isHovered })
            )}
        </motion.div>
    );
}

function DockLabel({ children, className = "", ...rest }) {
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = isHovered.on("change", (latest) => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`dock-label ${className}`}
                    role="tooltip"
                    style={{ x: "-50%" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function DockIcon({ children, className = "" }) {
    return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
    items,
    className = "",
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 68,
    dockHeight = 256,
    baseItemSize = 50,
}) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    // Hardcode dockTransparency to 0.2
    const dockTransparency = 0.2;

    // Compute background color with alpha for both modes
    const isDark = document.body.classList.contains('dark');
    const bgColor = isDark
        ? `rgba(24, 24, 27, ${dockTransparency})`
        : `rgba(248, 250, 252, ${dockTransparency})`;
    const borderColor = isDark ? '#444' : '#222';

    return (
        <div
            style={{ height: 'auto', scrollbarWidth: "none" }}
            className="dock-outer"
        >
            <div
                onMouseMove={({ pageX }) => {
                    isHovered.set(1);
                    mouseX.set(pageX);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseX.set(Infinity);
                }}
                className={`dock-panel ${className}`}
                style={{
                    height: panelHeight,
                    backgroundColor: bgColor,
                    border: `1px solid ${borderColor}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    zIndex: 20,
                    padding: '0.25rem 0.75rem',
                }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </div>
        </div>
    );
} 