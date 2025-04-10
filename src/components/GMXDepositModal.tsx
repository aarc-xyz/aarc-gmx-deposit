import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { AarcFundKitModal } from '@aarc-xyz/fundkit-web-sdk';
import { AARC_PROVIDER_ADDRESS, ARBITRUM_CHAIN_ID, SupportedChainId, USDC_TOKEN_ADDRESS } from '../constants';
import { Navbar } from './Navbar';
import StyledConnectButton from './StyledConnectButton';

export const GMXDepositModal = ({ aarcModal }: { aarcModal: AarcFundKitModal }) => {
    const [amount, setAmount] = useState('0.1');
    const { disconnect } = useDisconnect();

    const { address } = useAccount();

    const handleDisconnect = () => {
        // Reset all state values
        setAmount('0.1');

        // Disconnect wallet
        disconnect();
    };

    const handleDeposit = async () => {
        if (!address) return;

        try {
            // Generate calldata for deposit function
            const aarcGmxProivderInterface = new ethers.Interface([
                {
                    inputs: [
                        { internalType: "address", name: "token", type: "address" },
                        { internalType: "uint256", name: "amount", type: "uint256" },
                        { internalType: "address", name: "account", type: "address" },
                        { internalType: "uint256", name: "srcChainId", type: "uint256" }
                    ],
                    name: "deposit",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function"
                }
            ]);

            const amountInWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals

            const contractPayload = aarcGmxProivderInterface.encodeFunctionData("deposit", [
                USDC_TOKEN_ADDRESS,
                amountInWei,
                address,
                ARBITRUM_CHAIN_ID
            ]);

            aarcModal.updateRequestedAmount(Number(amount));

            // Update Aarc's destination contract configuration
            aarcModal.updateDestinationContract({
                contractAddress: AARC_PROVIDER_ADDRESS[SupportedChainId.ARBITRUM],
                contractGasLimit: "800000",
                contractPayload: contractPayload
            });

            // Open the Aarc modal
            aarcModal.openModal();
            setAmount('');
        } catch (error) {
            console.error("Error preparing deposit:", error);
            if (error instanceof Error) {
                console.error("Error details:", {
                    message: error.message,
                    stack: error.stack
                });
            }
            aarcModal.close();
        }
    };

    const shouldDisableInteraction = !address;

    return (
        <div className="min-h-screen bg-aarc-bg grid-background">
            <Navbar handleDisconnect={handleDisconnect} />
            <main className="mt-24 gradient-border flex items-center justify-center mx-auto max-w-md shadow-[4px_8px_8px_4px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col items-center w-[440px] bg-[#2D2D2D] rounded-[24px]  p-8 pb-[22px] gap-3">
                    {/* Amount Input */}
                    <div className="w-full">
                        <h3 className=" flex justify-start items-center gap-x-2 text-[14px] font-semibold text-[#F6F6F6] mb-4">Deposit into
                            <a href="https://gmx.io/" target="_blank" rel="noopener noreferrer">
                                <img
                                    className="h-3 w-auto"
                                    src="/gmx-name-logo.svg"
                                    alt="GMX Logo"
                                />
                            </a>
                        </h3>
                        {!address && <StyledConnectButton />}
                        <div className="flex items-center mt-4 p-3 bg-[#2A2A2A] border border-[#424242] rounded-2xl">
                            <div className="flex items-center gap-3">
                                <img src="/usdc-icon.svg" alt="USDC" className="w-6 h-6" />
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    pattern="^[0-9]*[.,]?[0-9]*$"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                    className="w-full bg-transparent text-[18px] font-semibold text-[#F6F6F6] outline-none"
                                    placeholder="Enter amount"
                                    disabled={shouldDisableInteraction}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="flex gap-[14px] w-full">
                        {['0.1', '0.3', '0.5', '0.7'].map((value) => (
                            <button
                                key={value}
                                onClick={() => setAmount(value)}
                                disabled={shouldDisableInteraction}
                                className="flex items-center justify-center px-2 py-2 bg-[rgba(83,83,83,0.2)] border border-[#424242] rounded-lg h-[34px] flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="text-[14px] font-semibold text-[#F6F6F6]">{value} USDC</span>
                            </button>
                        ))}
                    </div>

                    {/* Warning Message */}
                    <div className="flex gap-x-2 items-start p-4 bg-[rgba(255,183,77,0.05)] border border-[rgba(255,183,77,0.2)] rounded-2xl mt-2">
                        <img src="/info-icon.svg" alt="Info" className="w-4 h-4 mt-[2px]" />
                        <p className="text-xs font-bold text-[#F6F6F6] leading-5">
                            Important! The funds will be deployed into GMX instance deployed by Aarc. Please deposit only small amounts.
                        </p>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleDeposit}
                        disabled={shouldDisableInteraction}
                        className="w-full h-11 mt-2 bg-[#A5E547] hover:opacity-90 text-[#003300] font-semibold rounded-2xl border border-[rgba(0,51,0,0.05)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>

                    {/* Powered by Footer */}
                    <div className="flex flex-col items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-[#F6F6F6]">Powered by</span>
                            <img src="/aarc-logo-small.svg" alt="Aarc" />
                        </div>
                        <p className="text-[10px] text-[#C3C3C3]">
                            By using this service, you agree to Aarc <span className="underline cursor-pointer">terms</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GMXDepositModal;