import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginCard from '../component/loginCard';
import { Dashboard } from '../layout/DashboardLayout';
import ProfileAndContentLayout from '../layout/ProfileAndContentLayout';
import DocsLayout from '../layout/DocsLayout';
import OverviewLayout from '../layout/OverviewLayout';
import Upload from '../component/creator/Upload';
import TextEdit from '../component/creator/TextEdit';
import SaveContent from '../component/creator/SaveContent';
import PromoteUserForm from '../component/creator/PromoteUserForm';

import IrysStorage from '../component/users/IrysStorage';
import Content from '../component/users/Content';
import HomeProfil from '../component/users/HomeProfil';
import HomeContent from '../component/users/HomeContent';
import BecomeCreator from '../component/users/BecomeCreator';
import PublicImagesCard from '../component/cards/PublicImagesCard';
import PublicContentCard from '../component/cards/PublicContentCard';
import PublicProfileCard from '../component/cards/PublicProfileCard';

import NotFound from '../component/error/NotFound';
import Maintenance from '../component/error/Maintenance';

const CreatorRouters = (props) => {
    const { onImageUpload, initialTextData, imageData, onTextDataChange, onSave, finalData } = props;
    return (
        <div>
            <Routes>
                <Route index element={<Dashboard><Upload onImageUpload={onImageUpload} /></Dashboard>} />
                <Route path="text" element={<Dashboard><TextEdit initialTextData={initialTextData} imageData={imageData} onTextDataChange={onTextDataChange} onSave={onSave} /></Dashboard>} />
                <Route path="save" element={<Dashboard><SaveContent finalData={finalData} /></Dashboard>} />
            </Routes>
        </div>
    );
};

const RouterLeyout = (props) => {
    return (
        <div>
            <Routes>
                <Route index="/*" element={<Dashboard><Content /></Dashboard>} />
                <Route path="content" element={<Dashboard><Content /></Dashboard>} />
                <Route path="images/*" element={<Dashboard><PublicImagesCard /></Dashboard>} />
                <Route path="profile/*" element={<Dashboard><ProfileAndContentLayout sidebar={<PublicProfileCard />} mainContent={<PublicContentCard />} /></Dashboard>} />
                <Route path="welcome" element={<LoginCard />} />
                <Route path="home" element={<Dashboard><ProfileAndContentLayout sidebar={<HomeProfil />} mainContent={<HomeContent />} /></Dashboard>} />
                <Route path="storage" element={<Dashboard><IrysStorage /></Dashboard>} />
                <Route path="overview" element={<Dashboard><OverviewLayout /></Dashboard>} />
                <Route path="creator/*" element={<CreatorRouters {...props} />} />
                <Route path="irysup" element={<Dashboard><PromoteUserForm /></Dashboard>} />
                <Route path="become-creator" element={<Dashboard><BecomeCreator /></Dashboard>} />
                <Route path="docs/*" element={<DocsLayout />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default RouterLeyout;