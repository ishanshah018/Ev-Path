import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the theme.
const ThemeContext = createContext(undefined);

// A custom hook to access the theme context, with an error check.
export const useTheme = () => {
const context = useContext(ThemeContext);
if (!context) {
// This error will be thrown if the hook is not used inside a ThemeProvider.
throw new Error('useTheme must be used within a ThemeProvider');
}
return context;
};

// The provider component that manages the theme state.
export const ThemeProvider = ({ children }) => {
// State to hold the current theme mode (true for dark, false for light).
const [darkMode, setDarkMode] = useState(() => {
// Check if the user has a saved preference in local storage.
const saved = localStorage.getItem('darkMode');
if (saved) {
    return JSON.parse(saved);
}
// If no preference is saved, check the system's color scheme preference.
return window.matchMedia('(prefers-color-scheme: dark)').matches;
});

// Use an effect to update the `localStorage` and the `dark` class on the `<html>` element whenever `darkMode` changes.
useEffect(() => {
localStorage.setItem('darkMode', JSON.stringify(darkMode));
if (darkMode) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
}, [darkMode]);

// Function to toggle between dark and light mode.
const toggleDarkMode = () => {
setDarkMode(prev => !prev);
};

return (
// Provide the darkMode state and the toggle function to child components.
<ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
    {children}
</ThemeContext.Provider>
);
};
