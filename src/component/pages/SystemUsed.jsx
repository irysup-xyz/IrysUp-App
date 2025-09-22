import React from 'react';
import PageContent from '../docs/PageContent';
import one from '../../assets/one.png';
const SystemUsed = () => {
    return (
        <PageContent title='System Used'>
            <p>
                The operational workflow within IrysUp is designed to empower creators while ensuring user autonomy and data integrity. Below is an overview of our system:
            </p>

            <ul>
                <li>
                    <strong>Creator Upload:</strong> Creators generate and upload digital assets (e.g., images, icons) to the Irys DataChain via IrysUp.
                </li>
                <li>
                    <strong>Open Usage Rights:</strong> Once uploaded, these assets are made available for public use under open licensing terms—users are free to modify, adapt, and utilize them as needed.
                </li>
                <li>
                    <strong>User Actions:</strong> End users may either:
                    <ul>
                        <li>
                            Download the asset for offline use, or
                        </li>
                        <li>
                            Store it on-chain via the Irys DataChain for permanent, decentralized preservation.
                        </li>
                    </ul>
                </li>
            </ul>

            <img className="highlight-box"
                src={one}
            />

            <blockquote>
                <strong>
                    "Important Note (Current Phase):
                </strong>
                At this stage, all uploaded content is temporarily stored on centralized servers for operational efficiency during our testnet phase. Additionally, all files are currently being processed and anchored on the Sepolia testnet of the Irys DataChain.
                As per Irys’ testnet policy, on-chain data is retained for a maximum of 60 days before automatic deletion. This is a temporary limitation inherent to testnet environments and will be fully resolved upon migration to the mainnet, where data persistence is guaranteed indefinitely."
            </blockquote>
        </PageContent>
    );
};

export default SystemUsed;