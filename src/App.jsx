import React, { useState } from 'react';
import RouterLeyout from './routers/Router';
import { BrowserRouter } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider } from './context/AuthContext';
import { MobileProvider } from './context/MobileContext';
import { ApiConfigProvider } from './context/ApiConfigContext';
import Mobile from './component/mobile/Mobile';
import './App.css';


function App() {
    const [imageData, setImageData] = useState(null);
    const [initialTextData, setInitialTextData] = useState(null);
    const [finalData, setFinalData] = useState(null);

    const baseApiUrl= 'https://api.irysup.xyz';

    const onImageUpload = (imageData) => {
        console.log('Image Uploaded:', imageData);
        setImageData(imageData);
    };

    const onTextDataChange = (textData) => {
        console.log('Text Data Changed:', textData);
        setInitialTextData(textData);
    };

    const onSave = (designData) => {
        console.log('Design Saved:', designData);
        setFinalData(designData);
    };

    return (
        <BrowserRouter>
            <ApiConfigProvider baseApiUrl={baseApiUrl}>
                <MobileProvider>
                    <Mobile>
                        <AuthProvider>
                            <ProfileProvider>
                                <div className="app-container">
                                    <RouterLeyout
                                        onImageUpload={onImageUpload}
                                        initialTextData={initialTextData}
                                        imageData={imageData}
                                        onTextDataChange={onTextDataChange}
                                        onSave={onSave}
                                        finalData={finalData}
                                    />
                                </div>
                            </ProfileProvider>
                        </AuthProvider>
                    </Mobile>
                </MobileProvider>
            </ApiConfigProvider>
        </BrowserRouter>
    );
}

export default App;