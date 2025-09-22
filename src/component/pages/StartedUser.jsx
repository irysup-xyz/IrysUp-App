import React from 'react'
import PageContent from '../docs/PageContent';
import guideuser1 from '../../assets/guide/guide-user1.png';
import guideuser2 from '../../assets/guide/guide-user2.png';
const StartedUser = () => {
    return (
        <PageContent title='Started User'>
            <p>
                To create an account and begin exploring IrysUp, simply visit our platform at {''}
                <a
                    href="https://irysup.xyz"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    irysup.xyz
                </a>
            </p>
            <img src={guideuser1} className="highlight-box" />

            <p>
                click “Register” and fill out the provided form with your detail.
            </p>
            <img src={guideuser2} className="highlight-box" />
        </PageContent>

    );
};

export default StartedUser;