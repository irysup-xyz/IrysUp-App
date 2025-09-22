import React from 'react';
import PageContent from '../docs/PageContent';
import guide9 from '../../assets/guide/guide9.png';
import guide10 from '../../assets/guide/guide10.png';
import guide11 from '../../assets/guide/guide11.png';
import guide12 from '../../assets/guide/guide12.png';
import guide13 from '../../assets/guide/guide13.png';
import guide14 from '../../assets/guide/guide14.png';
import guide15 from '../../assets/guide/guide15.png';
import guide16 from '../../assets/guide/guide16.png';
import guide17 from '../../assets/guide/guide17.png';
import guide18 from '../../assets/guide/guide18.png';

const UploadFileGuide = () => {
    return (
        <PageContent title="Upload Images">
            <p>
                The IrysUp Storage page enables you to permanently store your personal files—images,
                documents, audio, or any other digital asset—on the decentralized Irys DataChain.
                This functionality is built entirely using the official Irys SDK, ensuring full compatibility,
                security, and transparency. You may review our{' '}
                <a
                    href="https://github.com/irysup"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--irysup-color-primary)', fontWeight: '500', textDecoration: 'underline' }}
                >
                    open-source implementation on GitHub
                </a>.
            </p>
            <p>
                <strong>
                    1. Connect Your Wallet
                </strong>
            </p>
            <ul>
                <li>
                    Before uploading, ensure your wallet is connected via the Wallet Connection
                    option in your Profile menu on the homepage.
                    Only wallets previously linked to IrysUp are supported.
                </li>
                <img src={guide9} className="highlight-box" />
            </ul>

            <p>
                <strong>
                    2. Connect to the Irys Network
                </strong>
            </p>
            <ul>
                <li>
                    Currently, IrysUp Storage operates exclusively on the Sepolia Testnet.
                    All transactions and file anchoring occur on this test network.
                    Please note that data stored here is temporary and subject to deletion after 60 days per Irys testnet policy.
                </li>
                <img src={guide10} className="highlight-box" />
            </ul>

            <p>
                <strong>
                    3. View Your Irys Address & Balance
                </strong>
            </p>
            <ul>
                <li>
                    Upon connection, your unique Irys wallet address
                    (distinct from your primary EVM address) and associated balance will be displayed.
                </li>
                <img src={guide11} className="highlight-box" />
                <li>
                    <strong>
                        Important:
                    </strong>
                    This balance is separate from your Ethereum or EVM wallet funds—it is dedicated solely to
                    Irys DataChain transaction fees (gas).
                </li>
                <img src={guide12} className="highlight-box" />
            </ul>

            <p>
                <strong>
                    4. Fund Your Irys Wallet (If Needed)
                </strong>
            </p>
            <ul>
                <li>
                    If your Irys wallet balance is insufficient, you may top it up with a small amount—e.g.,
                    0.001 ETH equivalent—to cover the gas fee required for on-chain storage.
                    Funds can be sent from your EVM wallet to your Irys address via standard crypto transfers.
                </li>
                <img src={guide13} className="highlight-box" />
            </ul>

            <p>
                <strong>
                    5. Select and Upload Your File
                </strong>
            </p>
            <ul>
                <li>
                    Choose any file from your device. The system automatically detects its type (image, PDF, video, etc.)
                    and prepares it for optimal anchoring on the Irys DataChain. No manual conversion is required.
                </li>
                <img src={guide14} className="highlight-box" />
                <img src={guide15} className="highlight-box" />
            </ul>

            <p>
                <strong>
                    6. Sign the Transaction
                </strong>
            </p>
            <ul>
                <li>
                    To confirm storage, you will be prompted to digitally sign a transaction using your connected wallet.
                    This signature authorizes the upload and ensures that only you—owner of the private key—can initiate the process.
                </li>
                <img src={guide16} className="highlight-box" />
                <img src={guide17} className="highlight-box" />
            </ul>

            <p>
                <strong>
                    7. Access Your On-Chain File
                </strong>
            </p>
            <ul>
                <li>
                    After successful submission, you will receive a unique Manifest Address—a permanent,
                    immutable IPFS-like identifier generated by Irys. You may use this address to:
                </li>
                <ul>
                    <li>
                        Verify your file’s existence on-chain
                    </li>
                    <li>
                        Share access with others
                    </li>
                    <li>
                        Re-download your file at any time
                    </li>
                </ul>
                <img src={guide18} className="highlight-box" />
            </ul>

            <blockquote>
                <strong>
                    Important Limitations (Current Phase):
                </strong>
                <ul>
                    <li>
                        <strong>
                            Refund / Withdrawal Feature:
                        </strong>
                        At this time, it is not possible to withdraw funds from your Irys wallet back to your primary EVM wallet.
                        This feature is under active development and will be enabled upon mainnet launch.
                    </li>
                    <li>
                        <strong>
                            Testnet Environment:
                        </strong>
                        All uploaded content is stored on the Sepolia testnet and will be automatically purged after 60 days.
                        This is intended for testing and demonstration purposes only. For permanent, production-grade storage,
                        please await our mainnet release.
                    </li>
                </ul>
            </blockquote>
        </PageContent>
    );
};

export default UploadFileGuide;