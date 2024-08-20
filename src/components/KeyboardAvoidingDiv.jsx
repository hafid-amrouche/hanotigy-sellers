import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const KeyboardAvoidingDiv = ({ children, offset = 24, ...props }) => {
    const containerRef = useRef(null);

    const scrollIntoView = (element) => {
        // Calculate the position of the element relative to the top of the page
        const rect = element.getBoundingClientRect();
        const offsetY = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + offsetY - offset; // Adjust by the given offset

        // Scroll the window to the target position
        window.scrollTo({
            top: targetY,
            behavior: 'smooth', // Smooth scrolling
        });
    };

    useEffect(() => {
        const handleFocus = (event) => {
            // Scroll the focused element into view after a small delay to account for the keyboard
            setTimeout(() => scrollIntoView(event.target), 100);
        };

        // Find all input elements within the container
        const inputs = containerRef.current.querySelectorAll('input, textarea, select');

        // Attach focus event listeners to all input elements
        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
        });

        // Cleanup event listeners on component unmount
        return () => {
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
            });
        };
    }, [offset]);

    return (
        <div ref={containerRef} style={{ paddingBottom: `${offset}px` }} {...props}>
            {children}
        </div>
    );
};

KeyboardAvoidingDiv.propTypes = {
    children: PropTypes.node.isRequired,
    offset: PropTypes.number, // Optional offset in pixels to scroll above the focused element
};

export default KeyboardAvoidingDiv;