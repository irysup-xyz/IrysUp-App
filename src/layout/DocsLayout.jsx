import React from 'react';
import Sidebar from '../component/docs/Sidebar';
import { Routes, Route } from 'react-router-dom';
import './DocsLayout.css';

import Introduction from '../component/pages/Introduction';
import WhyIrysUp from '../component/pages/WhyIrysUp';
import SystemUsed from '../component/pages/SystemUsed';
import ComingSoon from '../component/pages/ComingSoon';
import UploadImagesGuide from '../component/pages/UploadImagesGuide';
import DownloadImagesGuide from '../component/pages/DownloadImagesGuide';
import UploadFileGuide from '../component/pages/UploadFileGuide';
import Pricing from '../component/pages/Pricing';
import Security from '../component/pages/Security';
import RateLimits from '../component/pages/RateLimits';
import LatestVersion from '../component/pages/LatestVersion';
import NeedHelp from '../component/pages/NeedHelp';
import TermsNService from '../component/pages/TermsNService';
import TechnicalFAQ from '../component/pages/TechnicalFAQ';
import StartedUser from '../component/pages/StartedUser';
import StartedCreator from '../component/pages/StartedCreator';
import UpcomingFeatures from '../component/pages/UpcomingFeatures';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <div className="layout-sidebar">
                <Sidebar />
            </div>
            <main className="layout-main">
                {children}
            </main>
        </div>
    );
};

const DoscLayout = () => {
    return (
        <Routes>
            <Route index element={<Layout children={<Introduction />} />} />
            <Route path="introduction" element={<Layout children={<Introduction />} />} />
            <Route path="why-irysup" element={<Layout children={<WhyIrysUp />} />} />
            <Route path="system-used" element={<Layout children={<SystemUsed />} />} />

            <Route path="user" element={<Layout children={<StartedUser />} />} />
            <Route path="creator" element={<Layout children={<StartedCreator />} />} />
            <Route path="authentication" element={<Layout children={<ComingSoon title="Authentication" />} />} />

            <Route path="upload-images" element={<Layout children={<UploadImagesGuide />} />} />
            <Route path="download" element={<Layout children={<DownloadImagesGuide />} />} />
            <Route path="upload-file" element={<Layout children={<UploadFileGuide />} />} />

            <Route path="api" element={<Layout children={<ComingSoon title="Base URL & Authentication" />} />} />
            <Route path="endpoint-post" element={<Layout children={<ComingSoon title="Endpoint: Post" />} />} />
            <Route path="endpoint-get" element={<Layout children={<ComingSoon title="Endpoint: Get" />} />} />
            <Route path="respon" element={<Layout children={<ComingSoon title="Error Codes & Response Format" />} />} />

            <Route path="technical" element={<Layout children={<TechnicalFAQ />} />} />
            <Route path="help" element={<Layout children={<NeedHelp />} />} />

            <Route path="upcoming" element={<Layout children={<UpcomingFeatures />} />} />
            <Route path="latest" element={<Layout children={<LatestVersion />} />} />

            <Route path="limits" element={<Layout children={<RateLimits />} />} />
            <Route path="security" element={<Layout children={<Security />} />} />
            <Route path="terms" element={<Layout children={<TermsNService />} />} />
            <Route path="pricing" element={<Layout children={<Pricing />} />} />
        </Routes>
    );
};

export default DoscLayout;