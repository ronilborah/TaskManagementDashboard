import React from 'react';
import './GlitchText.css';

const GlitchText = ({
    children,
    speed = 1,
    enableShadows = true,
    enableOnHover = true,
    className = '',
    color = '#fff',
    afterShadow = '-5px 0 red',
    beforeShadow = '5px 0 cyan',
}) => {
    const inlineStyles = {
        '--after-duration': `${speed * 3}s`,
        '--before-duration': `${speed * 2}s`,
        '--after-shadow': enableShadows ? afterShadow : 'none',
        '--before-shadow': enableShadows ? beforeShadow : 'none',
        '--glitch-color': color,
    };
    const hoverClass = enableOnHover ? 'enable-on-hover' : '';
    return (
        <div
            className={`glitch ${hoverClass} ${className}`}
            style={inlineStyles}
            data-text={children}
        >
            {children}
        </div>
    );
};

export default GlitchText; 