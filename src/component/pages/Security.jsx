import React from 'react';
import PageContent from '../docs/PageContent';
import security from '../../assets/security.png';

const Security = () => {
    return (
        <PageContent title='Security'>
            <p>
                At IrysUp, we uphold the highest standards of user privacy and data protection.
                We never store your personal data—ever—not even your password.
            </p>
            <div className="highlight-box">

                <h4>
                    Here’s how we ensure your credentials remain secure:
                </h4>
                <ul>
                    <li>
                        <strong>
                            Client-Side Encryption (Frontend):
                        </strong>
                        When you enter your password, it is immediately encrypted on your device using
                        the industry-standard CryptoJS library before any data leaves your browser.
                    </li>
                    <li>
                        <strong>
                            Server-Side Re-Encryption:
                        </strong>
                        The encrypted payload is transmitted to our backend server,
                        where it undergoes a second, independent layer of cryptographic hashing with a unique,
                        randomly generated salt.
                    </li>
                    <li>
                        <strong>
                            Secure Storage:
                        </strong>
                        Only the final, double-encrypted hash is stored in our database.
                        Neither the original password nor the first encryption result is ever retained.
                    </li>
                </ul>
            </div>

            <blockquote>
                <strong>
                    This two-stage encryption architecture ensures that:
                </strong>
                Even if our database were compromised, no usable password information could be extracted.
                No entity—including IrysUp staff—can access, recover, or reverse-engineer your password.
            </blockquote>
            
            <img src={security} className="highlight-box" />
            <blockquote>
                Zero-Knowledge Design:
                IrysUp operates on a zero-knowledge principle—you hold all keys.
                We provide the platform; you retain full control over your identity and data.
            </blockquote>

        </PageContent>
    );
};

export default Security;