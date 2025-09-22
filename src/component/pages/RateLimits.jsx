import React from 'react';
import PageContent from '../docs/PageContent';

const RateLimits = () => {
    return (
        <PageContent title='Rate Limits'>

            <p>
                Currently, IrysUp is hosted on our private infrastructure with deployment managed via Vercel.
                To ensure system stability during this early development phase,
                API request limits have been implemented as a precautionary measure.
            </p>
            <blockquote>
                <p>
                    While we anticipate challenges—such as intermittent server errors or scalability constraints—we are actively monitoring,
                    optimizing, and scaling our architecture to deliver a seamless experience.
                    Your patience and feedback are invaluable as we work toward a fully decentralized, production-ready platform.
                </p>
            </blockquote>
        </PageContent>
    );
};

export default RateLimits;