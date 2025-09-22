import React from 'react';
import './ProfileAndContentLayout.css';

const ProfileAndContentLayout = ({ sidebar, mainContent }) => {
    return (
        <div className="content-layout-container">
            <div className="content-sidebar">
                {sidebar}
            </div>
            <div className="content-main-content">
                {mainContent}
            </div>
        </div>
    );
};

export default ProfileAndContentLayout;