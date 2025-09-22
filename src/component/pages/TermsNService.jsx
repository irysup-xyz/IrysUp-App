import React from 'react'
import PageContent from '../docs/PageContent';

const TermsNService = () => {
    return (
        <PageContent title='Terms & Service'>
            <p>
                IrysUp is a platform designed to empower creators
                with decentralized tools for sharing and storing original digital content.
            </p>
            <div className="highlight-box">

                <p>
                    To maintain a safe, respectful, and legally compliant environment,
                    we strictly prohibit the upload or distribution of any content that:
                </p>
                <ul>
                    <li>
                        Depicts violence, cruelty, or harm
                    </li>
                    <li>
                        Contains explicit sexual material or pornography
                    </li>
                    <li>
                        Violates intellectual property rights or third-party laws
                    </li>
                </ul>
            </div>
            <p>
                All assets uploaded to IrysUp must be your original work,
                or you must hold full legal rights to distribute them—consistent with standard design
                community guidelines and copyright principles. By uploading content,
                you affirm that you are the rightful owner or have obtained proper authorization for its use.
            </p>
            <p>
                We reserve the right to remove any content that violates these policies and may suspend accounts
                engaged in repeated or severe violations.
            </p>
            <blockquote>
                Thank you for helping us build a trustworthy, creative, and decentralized ecosystem for all.
            </blockquote>
        </PageContent>
    );
};

export default TermsNService;