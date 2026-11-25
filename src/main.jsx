import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './lib/i18n';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { SiteSettingsProvider } from './context/SiteSettingsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <SiteSettingsProvider>
                <App />
            </SiteSettingsProvider>
        </ThemeProvider>
    </React.StrictMode>,
);


