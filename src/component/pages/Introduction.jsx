import React from 'react';
import PageContent from '../docs/PageContent';
const Introduction = () => {
    return (
        <PageContent title="What is IrysUp?">
            <p>
                In the design industry, numerous platforms offer stock images, icons, and contest-based creative services. However, very few leverage decentralized data storage powered by blockchain technology. Moreover, many non-technical users remain unfamiliar with decentralized data storage solutions—particularly the concept of “datachains”—where files are securely preserved on-chain, eliminating the risk of loss or censorship.
            </p>

            <p>
                IrysUp addresses this gap by providing a decentralized platform built atop the Irys DataChain, a robust and cost-efficient blockchain-based storage solution designed for diverse file types. With minimal transaction fees—especially favorable for image storage—IrysUp empowers creators to publish and monetize their work in a truly decentralized manner, while enabling users to download, access, and securely store content on-chain.
            </p>

            <div className="highlight-box">
                <h4>Dual-Purpose Ecosystem</h4>
                <p>
                    Unlike conventional stock platforms, IrysUp offers a dual-purpose ecosystem:
                </p>
                <ul>
                    <li>
                        <strong>For Creators:</strong> Upload, tokenize, and share your digital assets (images, icons, illustrations, etc.) with global users, retaining full ownership and control.
                    </li>
                    <li>
                        <strong>For Users:</strong> Not only can you download high-quality content, but you can also securely store your own files on the Irys DataChain—ensuring permanent, tamper-proof preservation without relying on centralized servers.
                    </li>
                </ul>
            </div>

            <blockquote>
                IrysUp is not just a platform — it’s a movement toward decentralized, user-owned digital creativity.
            </blockquote>

        </PageContent>
    );
};

export default Introduction;