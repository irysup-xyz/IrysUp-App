import React from 'react';
import PageContent from '../docs/PageContent';
import guide1 from '../../assets/guide/guide1.png';
import guide2 from '../../assets/guide/guide2.png';
import guide3 from '../../assets/guide/guide3.png';
import guide4 from '../../assets/guide/guide4.png';
import guide5 from '../../assets/guide/guide5.png';
import guide6 from '../../assets/guide/guide6.png';

const UploadImagesGuide = () => {
    return (
        <PageContent title="Upload Images">
            <p>
                On the Creator Dashboard, you can begin uploading your artwork with ease:
            </p>
            <strong>
                1. Select Your Image:
            </strong>
            <ul>
                <img src={guide1} className="highlight-box" />
                <li>
                    Simply choose the image file you wish to upload from your device. Supported formats include PNG, JPG, JPEG, and SVG.
                </li>
                <img src={guide2} className="highlight-box" />
            </ul>

            <strong>
                2. Customize Your Asset:
            </strong>
            <ul>
                <p>
                    Once selected, you may personalize your creation directly within the interface:
                </p>
                <img src={guide3} className="highlight-box" />
                <li>
                    Edit the Title: Add or modify the name of your work to reflect its intent or theme.
                </li>
                <img src={guide4} className="highlight-box" />
                <li>
                    Choose a Font: Select from a curated library of typefaces to embed text overlays (if applicable).
                    (Note: All text modifications are rendered as part of the final image and embedded into the uploaded file.)
                </li>
                <img src={guide5} className="highlight-box" />
            </ul>

            <strong>
                3. Add a Title
            </strong>
            <ul>
                <p>
                    Provide a meaningful title for your artwork.
                    This will serve as its public identifier on the platform and assist other users in discovering your work.
                </p>
                <img src={guide6} className="highlight-box" />
            </ul>

            <blockquote>
                <strong>"Important Note: </strong>
                If you decide to cancel the upload process, please click the “Cancel” button.
                Until the upload is finalized, your file remains temporarily stored on our servers
                during processing. Canceling ensures that unused or incomplete uploads are promptly removed,
                helping us maintain optimal server efficiency and resource allocation while we transition to full decentralization."
            </blockquote>
        </PageContent>
    );
};

export default UploadImagesGuide;