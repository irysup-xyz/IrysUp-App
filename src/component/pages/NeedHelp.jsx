import React from 'react';
import PageContent from '../docs/PageContent';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const NeedHelp = () => {
    return (
        <PageContent title='Need Help?'>
            <p>
                If you require assistance, have technical inquiries,
                or wish to learn more about IrysUp’s decentralized ecosystem, we’re here to support you.
            </p>
            <p>
                You can reach out to us through any of the social media channels below,
                or contact our development team directly for in-depth guidance on blockchain integration,
                API usage, or storage workflows.
            </p>
            <blockquote>
                We value your feedback—and are committed to building a platform that empowers creators,
                securely and sustainably.
            </blockquote>

            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <FiMail /> {''}
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=irysupxyz@gmail.com&su=Feedback%20for%20IrysUp&body=Hello%2C%0A%0AI%27d%20like%20to%20share%20some%20feedback%20about%20the%20IrysUp%20platform.%0A%0AThank%20you!"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    irysupxyz@gmail.com
                </a> (Official)
            </p>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <FaTwitter /> {''}
                <a
                    href="https://x.com/irysup.xyz"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    @irysup.xyz
                </a> (Official)
            </p>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <FaTwitter /> {''}
                <a
                    href="https://x.com/re_rowetxyz"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    @re_rowetxyz
                </a> (Development)
            </p>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <FaTwitter /> {''}
                <a
                    href="https://x.com/zk_zora"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    @zk_zora
                </a> (Development)
            </p>
            <blockquote>
                If you’re a developer and passionate about decentralized design,
                open-source innovation, or blockchain-based creative ecosystems—we’d love your help!
            </blockquote>
            <p style={{ margin: '1.5rem', fontStyle: 'italic', color: 'var(--irysup-color-text-muted)' }}>
                <FaGithub /> {''}
                <a
                    href="https://github.com/irysup-xyz"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    irysup-xyz
                </a> (Official)
            </p>

        </PageContent>
    );
};

export default NeedHelp;