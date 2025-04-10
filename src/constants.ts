export enum SupportedChainId {
    // BASE = 8453,
    ARBITRUM = 42161,
}

export type AddressMap = {
    [chainId: number]: string;
};

export const AARC_PROVIDER_ADDRESS: AddressMap = {
    // [SupportedChainId.BASE]: '0x41AdD1Ea600301aa27b593F080E75824Dd35Fc53'
    [SupportedChainId.ARBITRUM]: '0x22198E2f51a54498B66A3E8180a9a82a1A491eA3'
};

export const USDC_TOKEN_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // Arb USDC address
export const ARBITRUM_CHAIN_ID = 42161; // Arbitrum chain ID