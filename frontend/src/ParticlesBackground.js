import React, { useCallback, useMemo } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = ({ isDarkMode }) => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    const options = useMemo(() => ({
        background: {
            color: {
                value: isDarkMode ? "#000000" : "#f3f4f6",
            },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: isDarkMode ? "#ffffff" : "#000000",
            },
            links: {
                color: isDarkMode ? "#ffffff" : "#000000",
                distance: 150,
                enable: true,
                opacity: isDarkMode ? 1 : 0.3,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 50,
            },
            opacity: {
                value: isDarkMode ? 1 : 0.3,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 3 },
            },
        },
        detectRetina: true,
    }), [isDarkMode]);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={options}
            style={{
                position: 'fixed',
                width: '100%',
                height: '100%',
                zIndex: -1,
                top: 0,
                left: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticlesBackground; 