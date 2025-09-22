import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WebUploader } from "@irys/web-upload";
import { WebEthereum } from "@irys/web-upload-ethereum";
import { execToIrysAddr } from '@irys/js/common/utils';
import { EthersV6Adapter } from "@irys/web-upload-ethereum-ethers-v6";
import { useProfile } from '../../context/ProfileContext.jsx';
import { FaRegFolder } from 'react-icons/fa6';
import useUserApi from '../../hooks/useUserApi.js';
import { useApiConfig } from '../../context/ApiConfigContext.jsx';
import './IrysStorage.css';

function IrysStorage() {
    const [walletStatus, setWalletStatus] = useState("Not connected");
    const [irysStatus, setIrysStatus] = useState("Not connected");
    const [irysAddress, setIrysAddress] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const [balanceStatus, setBalanceStatus] = useState("Check balance after connecting to Irys");
    const [balance, setBalance] = useState("0");
    const [fundAmount, setFundAmount] = useState("");
    const [fundStatus, setFundStatus] = useState("");
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [userFiles, setUserFiles] = useState([]);
    const [filesLoading, setFilesLoading] = useState(false);
    const [filesError, setFilesError] = useState("");
    const [walletServerError, setWalletServerError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const filesPerPage = 4;

    const { profileData, updateProfile, loading } = useProfile();
    const { baseApiUrl } = useApiConfig();
    const { addFile, getUserFile } = useUserApi();

    const fetchUserFiles = async () => {
        if (!profileData?.irysId) return;

        setFilesLoading(true);
        setFilesError("");
        try {
            const result = await getUserFile(profileData.irysId);
            if (result.success && result.data?.file) {
                const sortedFiles = result.data.file.sort((a, b) => new Date(b.date) - new Date(a.date));
                setUserFiles(sortedFiles);
                setCurrentPage(1);
            } else {
                setFilesError(result.message || "No files found.");
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            setFilesError("Failed to load files.");
        } finally {
            setFilesLoading(false);
        }
    };

    useEffect(() => {
        if (profileData?.irysId) {
            fetchUserFiles();
        }
    }, [profileData?.irysId]);

    const getPaginatedFiles = () => {
        const startIndex = (currentPage - 1) * filesPerPage;
        const endIndex = startIndex + filesPerPage;
        return userFiles.slice(startIndex, endIndex);
    };

    const connectWallet = async () => {
        setWalletServerError("");
        if (typeof window.ethereum === "undefined") {
            setWalletStatus("No Ethereum provider found. Install MetaMask.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const irysAddr = execToIrysAddr(address);

            const message = `I am verifying ownership of this wallet for my IrysUp profile.
IrysID: ${profileData.irysId}
EVM Address: ${address}
Irys Address: ${irysAddr}
Timestamp: ${Date.now()}`;

            const signature = await signer.signMessage(message);

            const response = await fetch(`${baseApiUrl}/user/verify-address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('userToken') || localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    irysId: profileData.irysId,
                    address,
                    irysAddress: irysAddr,
                    signature,
                    message,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setWalletServerError(errorData.message || "Unknown server error");
                throw new Error(errorData.message || 'Failed to verify address');
            }

            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: "0xaa36a7",
                                    chainName: "Sepolia Testnet",
                                    nativeCurrency: {
                                        name: "SepoliaETH",
                                        symbol: "ETH",
                                        decimals: 18,
                                    },
                                    rpcUrls: ["https://eth-sepolia.public.blastapi.io"],
                                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error("Failed to add Sepolia network", addError);
                        setWalletStatus("Failed to add Sepolia network. Check console.");
                        return;
                    }
                }
            }

            setWalletStatus("Connected");
            setIrysAddress(irysAddr);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            if (!walletServerError) {
                setWalletStatus("Error connecting wallet");
            }
        }
    };

    const connectIrys = async () => {
        if (typeof window.ethereum === "undefined") {
            setIrysStatus("No Ethereum provider found.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);

            const irysUploader = await WebUploader(WebEthereum)
                .withAdapter(EthersV6Adapter(provider))
                .withRpc("https://eth-sepolia.public.blastapi.io")
                .devnet();

            const addr = execToIrysAddr(irysUploader.address);
            setIrysAddress(addr);
            setIrysStatus("Connected");
            window.irysUploader = irysUploader;

            checkBalance();
            setInterval(checkBalance, 30000);
        } catch (error) {
            console.error("Error connecting to Irys:", error);
            setIrysStatus("Error connecting to Irys: " + error.message);
        }
    };

    const checkBalance = async () => {
        if (!window.irysUploader) {
            setBalanceStatus("Please connect to Irys first.");
            return;
        }

        try {
            setBalanceStatus("Checking...");
            const atomicBalance = await window.irysUploader.getLoadedBalance();
            const ethBalance = window.irysUploader.utils.fromAtomic(atomicBalance);
            setBalance(ethBalance.toFixed(6));

            if (ethBalance < 0.1) {
                setBalanceStatus(`Low: ${ethBalance.toFixed(6)} ETH`);
            } else {
                setBalanceStatus(`Balance: ${ethBalance.toFixed(6)} ETH`);
            }
        } catch (error) {
            console.error("Error checking balance:", error);
            setBalanceStatus(`Error: ${error.message}`);
        }
    };

    const fundAccount = async () => {
        if (!window.irysUploader) {
            setFundStatus("Please connect to Irys first.");
            return;
        }

        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) {
            setFundStatus("Enter a valid amount > 0.");
            return;
        }

        setFundStatus("Funding...");

        try {
            const atomicAmount = window.irysUploader.utils.toAtomic(amount);
            const fundTx = await window.irysUploader.fund(atomicAmount);

            const fundedAmount = window.irysUploader.utils.fromAtomic(fundTx.quantity);
            setFundStatus(`Funded: ${fundedAmount} ETH ✅`);
            setFundAmount("");
            checkBalance();
        } catch (e) {
            console.error("Error when funding:", e);
            setFundStatus(`Failed: ${e.message}`);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadStatus("");
    };

    const uploadFile = async () => {
        if (!file) {
            setUploadStatus("Select a file first.");
            return;
        }

        if (!window.irysUploader) {
            setUploadStatus("Connect Irys first.");
            return;
        }

        setIsUploading(true);
        setUploadStatus("Uploading...");

        try {
            const contentType = file.type || "application/octet-stream";
            const tags = [{ name: "Content-Type", value: contentType }];

            const receipt = await window.irysUploader.uploadFile(file, tags);
            const url = `https://gateway.irys.xyz/${receipt.id}`;

            const data = {
                irysId: profileData.irysId,
                irysAddress: irysAddress,
                fileName: file.name,
                fileUrl: url,
                fileType: contentType,
                fileSize: file.size,
                transactionId: receipt.id,
                date: Date.now()
            };

            await addFile(data);
            await fetchUserFiles();

            setUploadStatus(`Uploaded!`);
            setFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus(`Failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="irys-container">
            <section className="irys-section header-status">
                <div className="status-row">
                    <div className="status-item">
                        <span className="status-label">Wallet</span>
                        <button
                            onClick={connectWallet}
                            disabled={walletStatus === "Connected"}
                            className={`btn btn-sm ${walletStatus === "Connected" ? 'btn-connected' : ''}`}
                        >
                            {walletStatus === "Connected" ? "✓ Connected" : "Connect"}
                        </button>

                        {walletServerError && (
                            <p className="server-error">
                                {walletServerError}
                            </p>
                        )}
                    </div>

                    <div className="status-item">
                        <span className="status-label">Irys</span>
                        <button
                            onClick={connectIrys}
                            disabled={walletStatus !== "Connected" || irysStatus === "Connected"}
                            className={`btn btn-sm ${irysStatus === "Connected" ? 'btn-connected' : ''}`}
                        >
                            {irysStatus === "Connected" ? "✓ Connected" : "Connect"}
                        </button>
                    </div>

                    <div className="status-item balance">
                        <span className="status-label">Balance</span>
                        <p className={`status-value ${balanceStatus.includes('Low') ? 'warning' : balanceStatus.includes('Error') ? 'error' : 'success'}`}>
                            {balanceStatus}
                        </p>
                    </div>
                </div>

                {irysAddress && (
                    <p className="irys-address">
                        Irys Address: <code>{irysAddress}</code>
                    </p>
                )}
            </section>

            <div className="content-grid">
                <div className="content-column left">
                    <section className="irys-section">
                        <h2>Fund Account</h2>
                        <div className="input-group">
                            <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                placeholder="0.05 ETH"
                                disabled={!irysStatus.includes("Connected")}
                                className="input"
                            />
                            <button
                                onClick={fundAccount}
                                disabled={!fundAmount || !irysStatus.includes("Connected")}
                                className="btn fund"
                            >
                                Fund
                            </button>
                        </div>
                        <p className={`status ${getStatusClass(fundStatus)}`}>{fundStatus}</p>
                        <p className="footnote">
                            Need Sepolia ETH? Get free test ETH at:{" "}
                            <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="link">
                                sepoliafaucet.com
                            </a>
                        </p>
                    </section>

                    <section className="irys-section">
                        <h2>Upload File</h2>
                        <label className="file-label">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                disabled={!irysStatus.includes("Connected")}
                                className="file-input"
                            />
                            <span className="file-label-text">
                                {file ? file.name : "Choose a file..."}
                            </span>
                            <span className="file-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </span>
                        </label>
                        <button
                            onClick={uploadFile}
                            disabled={!file || isUploading || !irysStatus.includes("Connected")}
                            className="btn upload"
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                        <p className={`status ${getStatusClass(uploadStatus)}`}>{uploadStatus}</p>
                        {uploadStatus === "Uploaded!" && (
                            <p className="success-link">
                                Your file is now live on the decentralized web.
                            </p>
                        )}
                    </section>
                </div>

                <div className="content-column right">
                    <section className="irys-section">
                        <div className="flex-between">
                            <h2>Your Files</h2>
                            <div className="pagination-controls">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="btn btn-outline"
                                    style={{ marginRight: '0.5rem' }}
                                >
                                    {'<'}
                                </button>
                                <button onClick={fetchUserFiles} className="btn btn-outline" style={{ marginRight: '0.5rem' }}>
                                    Refresh
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => {
                                        const totalPages = Math.ceil(userFiles.length / filesPerPage);
                                        return prev < totalPages ? prev + 1 : prev;
                                    })}
                                    disabled={currentPage >= Math.ceil(userFiles.length / filesPerPage)}
                                    className="btn btn-outline"
                                >
                                    {'>'}
                                </button>
                            </div>
                        </div>

                        {filesLoading ? (
                            <p className="status">Loading files...</p>
                        ) : filesError ? (
                            <p className="status error">{filesError}</p>
                        ) : userFiles.length > 0 ? (
                            <ul className="files-list">
                                {getPaginatedFiles().map((file, index) => {
                                    const fileUrl = file.Url || '';
                                    const fileName = file.name || 'Unknown file';
                                    const fileSize = formatFileSize(file.size || 0);
                                    const fileId = fileUrl.split('/').pop().substring(0, 8) + '...' || 'N/A';
                                    const date = new Date(file.date).toLocaleDateString();

                                    return (
                                        <li key={index} className="file-item">
                                            <div className="file-info">
                                                <FaRegFolder className="file-icon" />
                                                <div className="file-details">
                                                    <span className="file-name">{fileName}</span>
                                                    <div className="file-meta">
                                                        <span>{fileSize}</span>
                                                        <span>•</span>
                                                        <span>{date}</span>
                                                        <span>•</span>
                                                        <code>{fileId}</code>
                                                    </div>
                                                </div>
                                            </div>
                                            <a
                                                href={file.Url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline file-link"
                                            >
                                                View
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="empty-state">
                                <FaRegFolder className="empty-icon" />
                                <p className="empty-text">No files uploaded yet.</p>
                                <p className="empty-subtext">Upload your first file to get started.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

function getStatusClass(status) {
    if (status.includes("Error") || status.includes("failed")) return "error";
    if (status.includes("Success") || status.includes("✅") || status === "Uploaded!" || status.includes("Funded")) return "success";
    return "";
}

export default IrysStorage;