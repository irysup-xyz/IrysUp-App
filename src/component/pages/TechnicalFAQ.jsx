import React from 'react'
import PageContent from '../docs/PageContent';
const TechnicalFAQ = () => {
    return (
        <PageContent title='Technical FAQ'>
            <strong>
                • Is IrysUp free to use?
            </strong>
            <p>
                {''}
            </p>
            <p>
                <strong>
                    Yes — IrysUp
                </strong>
                {''} currently provides its core services at no cost to users.
                We do not charge any fees for uploading, downloading, or storing content.

                That said, as our community grows, we are open to exploring optional premium
                features in the future—for example, allowing creators to designate certain assets as
                “premium” with optional token-based access or royalties. Any such model would be community-driven,
                opt-in, and fully transparent.
            </p>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <a
                    href="/docs/pricing"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    For more details, please review our Pricing
                </a>.
            </p>

            <strong>
                • Do you collect my personal data?
            </strong>
            <p>
                {''}
            </p>
            <p>
                <strong>
                    No — IrysUp
                </strong>
                {''} does not collect, store, or process any personally identifiable information (PII),
                including passwords, email addresses, or browsing behavior.

                Your password is encrypted client-side before transmission,
                then re-encrypted server-side using industry-standard hashing techniques—never
                stored in plaintext or reversible form.
            </p>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <a
                    href="/docs/pricing"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    Learn more about our privacy commitments in our Security
                </a>.
            </p>

            <strong>
                • Are my uploaded files encrypted?
            </strong>
            <p>
                {''}
            </p>
            <p>
                <strong>
                    At this time,
                </strong>
                {''} files uploaded via IrysUp are not end-to-end encrypted,
                as most assets remain temporarily hosted on centralized servers during our testnet phase.
                However, once fully migrated to the Irys DataChain mainnet,
                we plan to implement encryption aligned with the official Irys SDK,
                ensuring that all on-chain content is cryptographically secured by default.

                <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                    We are actively working toward full decentralization and zero-trust security architecture.
                </p>
            </p>

            <strong>
                • How do I become a creator?
            </strong>
            <p>
                {''}
            </p>
            <p>
                Becoming a creator is simple:
            </p>
            <ul>
                <li>
                    Visit the Home page of the application.
                </li>
                <li>
                    Click “Sign Up” or “Become a Creator”.
                </li>
            </ul>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                Note: All content must be your original creation or legally authorized for distribution.
            </p>

            <strong>
                • Still have questions?
            </strong>
            <p>
                {''}
            </p>
            <p>
                If your question isn’t answered here, please reach out to us via the {''}
                <a
                    href="/docs/help"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    Need Help?
                </a> section.

                <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                    Our team is committed to supporting creators and users as we build the future of decentralized design together.
                </p>
            </p>
        </PageContent>

    );
};

export default TechnicalFAQ;