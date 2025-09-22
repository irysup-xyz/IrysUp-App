import React from 'react';
import { Link } from 'react-router-dom';
import './Maintenance.css';

const Maintenance = () => {
    return (
        <div className="maintenance-container">
            <h1 className="maintenance-title">Under Maintenance</h1>

            <div className="maintenance-code-block">
                {`We’re making things better. Please check back soon.`}
            </div>

            <Link to="" onClick={(e) => {
                e.preventDefault();
                window.location.reload();
            }} className="maintenance-refresh-link">
                ↻ Refresh Page
            </Link>
        </div>
    );
};

export default Maintenance;