import React from 'react';
import PageContent from '../docs/PageContent';
import guidecreator from '../../assets/guide/guide-creator.png';
const StartedCreator = () => {
    return (
        <PageContent title='Started User'>
            <p>
                If you’re an artist, designer, or content creator looking to share your work on-chain:
            </p>
            <ul>
                <li>
                    Go to the Home page of IrysUp.
                </li>
                <li>
                    Click the “Become a Creator” button.
                </li>
            </ul>

            <img src={guidecreator} className="highlight-box" />
        </PageContent>

    );
};

export default StartedCreator;