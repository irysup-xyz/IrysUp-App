import React from 'react';
import './PageContent.css';

const PageContent = ({ title, subtitle, children }) => {
    return (
        <div className="page-content">
            <h1>{title}</h1>
            {subtitle && <p style={{ fontSize: 'var(--irysup-font-size-md)', color: 'var(--irysup-color-text-muted)' }}>{subtitle}</p>}
            {children}
        </div>
    );
};

export default PageContent;