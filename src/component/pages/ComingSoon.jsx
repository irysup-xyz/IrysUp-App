import React from 'react';
import PageContent from '../docs/PageContent';

const ComingSoon = ({ title }) => {
    return (
        <PageContent title={title || "Coming Soon"}>
            <div className="highlight-box" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <h2>We're building something awesome</h2>
                <p>
                    This section — <strong>{title}</strong> — is under active development.
                    Check back soon or follow our updates on social media!
                </p>
            </div>
        </PageContent>
    );
};

export default ComingSoon;