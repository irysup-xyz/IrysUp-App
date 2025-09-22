import React from 'react';
import PageContent from '../docs/PageContent';
import guide7 from '../../assets/guide/guide7.png';
import guide8 from '../../assets/guide/guide8.png';

const DownloadImagesGuide = () => {
    return (
        <PageContent title="Download Images & Edit">
            <p>
                Downloading and Storing Your Selected Asset
            </p>
            <strong>
                1. Customize as Needed:
            </strong>
            <ul>
                <li>
                    You may edit the asset directly within the platform to suit your creative needs—adjusting colors, cropping, or adding text. All modifications are applied locally in your browser and do not alter the original file on-chain.
                </li>
                <img src={guide7} className="highlight-box" alt="Customization interface" />
                <li>
                    <strong>
                        Download for Offline Use:
                    </strong>
                    To save a copy of your customized version to your local device,
                    click the “Download” button. The file will be saved in high resolution in standard formats
                    (PNG/JPG), ready for use in your designs, presentations, or publications.
                </li>
                <li>
                    <strong>
                        Store On-Chain with Irys Storage:
                    </strong>
                    If you wish to permanently preserve your modified version on the decentralized
                    Irys DataChain—ensuring it is tamper-proof, censorship-resistant,
                    and always accessible—navigate to the Irys Storage page.
                </li>
                <img src={guide8} className="highlight-box" alt="Irys Storage interface" />
            </ul>
            <blockquote>
                <strong>Important Note: </strong>
                The “Save to Irys” button is currently disabled as we prepare for full mainnet integration. This feature will be fully operational upon our official migration from the Sepolia testnet.
                Until then, all on-chain storage functionality remains in testing mode. We appreciate your patience as we ensure a secure, seamless experience before enabling this capability for all users.
            </blockquote>
        </PageContent>
    );
};

export default DownloadImagesGuide;