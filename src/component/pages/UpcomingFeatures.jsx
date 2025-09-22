import React from 'react'
import PageContent from '../docs/PageContent';
const UpcomingFeatures = () => {
    return (
        <PageContent title="Upcoming Features">
            <p>
                Our vision is to become the leading decentralized platform for creators to publish, share,
                and permanently store digital assets on the blockchain. Below is our phased roadmap toward that goal:
            </p>

            <blockquote>
                <strong>
                    Phase 1: Launch & Public Introduction (Now)
                </strong>
            </blockquote>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                We’ve officially launched IrysUp to the public — introducing creators and users to a
                new paradigm of decentralized stock content. The core platform is live, enabling file uploads,
                downloads, and testnet-based on-chain storage via the Irys DataChain.
            </p>

            <blockquote>
                <strong>
                    Phase 2: Cross-Platform Accessibility (Ongoing)
                </strong>
            </blockquote>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                We are developing a responsive, mobile-optimized web application to ensure seamless access across all devices
                — desktop, tablet, and smartphone. Our goal:
                empower creators and users to engage with IrysUp anytime, anywhere — without requiring native apps.
            </p>

            <blockquote>
                <strong>
                    Phase 3: Feature Expansion & User-Centric Enhancements (Ongoing)
                </strong>
            </blockquote>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                Based on community feedback, we are actively developing high-demand features including:
                <ul >
                    <li style={{ color: 'var(--irysup-color-text-muted)' }}>
                        File encryption using the existing Irys SDK.
                    </li>
                    <li style={{ color: 'var(--irysup-color-text-muted)' }}>
                        Advanced image customization tools
                    </li>
                    <li style={{ color: 'var(--irysup-color-text-muted)' }}>
                        License tagging and attribution support
                    </li>
                    <li style={{ color: 'var(--irysup-color-text-muted)' }}>
                        Search and filtering by category, style, or tags
                    </li>
                    <li style={{ color: 'var(--irysup-color-text-muted)' }}>
                        Wallet integration for multi-chain compatibility
                    </li>
                </ul>
                Every enhancement is designed to improve usability while preserving decentralization.
            </p>

            <blockquote>
                <strong>
                    Phase 4: Full On-Chain Storage Migration (Ongoing)
                </strong>
            </blockquote>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                All user content — including uploaded images, metadata, and customizations — will be fully anchored to the Irys DataChain.
                This eliminates reliance on centralized servers and ensures permanent, censorship-resistant storage for every asset.
            </p>

            <blockquote>
                <strong>
                    Phase 5: Mainnet Focus & Ecosystem Growth (Ongoing)
                </strong>
            </blockquote>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                We will shift all operations from the Sepolia testnet to the Irys mainnet, enabling true permanence,
                low-cost transactions, and long-term sustainability. Concurrently, we will begin exploring integrations
                with NFT marketplaces,
                DAO governance models, and creator incentive programs to build a thriving decentralized creative economy.
            </p>
        </PageContent>
    );
};

export default UpcomingFeatures;