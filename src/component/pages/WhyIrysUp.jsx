import React from 'react';
import PageContent from '../docs/PageContent';

const WhyIrysUp = () => {
    return (
        <PageContent title="Why IrysUp?">
            <p>
                IrysUp is uniquely positioned as the user-friendly platform that bridges the gap between decentralized storage and mainstream creatives. Key differentiators include:
            </p>

            <div className="highlight-box">
                <h4>Core Advantages</h4>
                <ul>
                    <li>
                        <strong>Decentralized Content Publishing:</strong> Share your creations with the world while maintaining provenance and ownership via blockchain verification.
                    </li>
                    <li>
                        <strong>On-Chain Storage Interface:</strong> A seamless, intuitive UI allows users to upload and store personal files directly on the Irys DataChain — no technical expertise required.
                    </li>
                    <li>
                        <strong>Accessibility for Non-Technical Users:</strong> Designed specifically for creators, designers, and everyday users unfamiliar with command-line interfaces (CLI), scripting, or blockchain development. No wallets, keys, or complex configurations are needed to get started.
                    </li>
                </ul>
            </div>

            <blockquote>
                IrysUp removes the friction of blockchain — so creativity, not complexity, takes center stage.
            </blockquote>

            <h3>Who Is This For?</h3>
            <p>
                Whether you’re a digital artist sharing your portfolio, a designer uploading UI kits, or a casual user backing up precious memories — IrysUp gives you permanent, censorship-resistant ownership without asking you to become a developer.
            </p>
        </PageContent>
    );
};

export default WhyIrysUp;