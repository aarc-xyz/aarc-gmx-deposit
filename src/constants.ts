export enum SupportedChainId {
    BASE = 8453
}

export type AddressMap = {
    [chainId: number]: string;
};

export const AARC_PROVIDER_ADDRESS: AddressMap = {
    [SupportedChainId.BASE]: '0x85228c474b480fc1ead5e3fc10280941258b3845'
};

export const USDC_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC address
export const BASE_CHAIN_ID = 8453; // Base chain ID