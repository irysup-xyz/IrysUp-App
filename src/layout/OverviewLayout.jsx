import React from 'react';
import Overview from '../component/users/Overview';
import UserActivityDashboard from '../component/users/UserActivityDashboard';
import './OverviewLayout.css';

const OverviewLayout = () => {
    return (
        <div className="dashboard-grid">
            <div className="dashboard-column">
                <Overview periodType="daily" />
            </div>
            <div className="dashboard-column">
                <UserActivityDashboard limit={1000} />
            </div>
        </div>
    );
};

export default OverviewLayout;