import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404 | Page Not Found</h1>

            <div className="not-found-code-block">
                The page you’re looking for doesn’t exist or has been moved.
                We suggest heading back to safety.
            </div>

            <Link to="/home" className="not-found-home-link">
                ← Go Home
            </Link>
        </div>
    );
};

export default NotFound;