import React from 'react';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="social-footer">
            <div className="footer-content">
                <div className="footer-section footer-about">
                    <h3 className="footer-title">About</h3>
                    <p className="footer-text">
                        IrysUp is a simple, friendly space for Irys creators. It helps you share your work and easily connect to the Irys Datachain — where your content lives forever, decentralized and secure. 
                        Perfect for artists, builders, and storytellers. Welcome to the future of creative freedom.
                    </p>
                </div>

                <div className="footer-section footer-links">
                    <h3 className="footer-title">Resources</h3>
                    <ul className="footer-list">
                        <li><a href="/docs" className="footer-link">Docs</a></li>
                        <li><a href="/docs/api" className="footer-link">API</a></li>
                    </ul>
                </div>

                <div className="footer-section footer-social">
                    <h3 className="footer-title">Connect</h3>
                    <div className="social-icons">
                        <a
                            href="https://github.com/irysup-xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="GitHub"
                        >
                            <FaGithub />
                        </a>
                        <a
                            href="https://twitter.com/irysupxyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="https://discord.gg/irysupxyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="Discord"
                        >
                            <FaDiscord />
                        </a>
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=irysupxyz@gmail.com&su=Feedback%20for%20IrysUp&body=Hello%2C%0A%0AI%27d%20like%20to%20share%20some%20feedback%20about%20the%20IrysUp%20platform.%0A%0AThank%20you!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                            aria-label="gmail"
                        >
                            <FiMail />
                        </a>
                    </div>
                    <p className="footer-thanks-text">
                        Thanks to our community.
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-copyright">
                    <span className="footer-copyright-text">
                        ©2025 IrysUp • Built by the Community
                    </span>
                    <span className="footer-separator">•</span>
                    <a href="/docs/terms" className="footer-link">Terms & Service</a>
                    <span className="footer-separator">•</span>
                    <a href="/docs/security" className="footer-link">Privacy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;