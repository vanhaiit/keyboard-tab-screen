import { MetaMaskInpageProvider } from '@metamask/providers';
import Config from 'react-native-config';

export const setupNetwork = async (
  provider?: MetaMaskInpageProvider,
): Promise<boolean> => {
  if (provider) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Config.HEX_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      const error = switchError as { code: number; message: string };
      if (
        error?.code === 4902 ||
        error?.code === -32603 ||
        (error?.code === -32000 &&
          error?.message?.includes('wallet_addEthereumChain'))
      ) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: Config.HEX_CHAIN_ID,
                chainName: Config.CHAIN_NAME,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [Config.RPC_URL],
                blockExplorerUrls: [Config.SCAN_URL],
              },
            ],
          });
          return true;
        } catch (error: any) {
          if (
            error.code === 4001 ||
            (error instanceof Error &&
              error.message === 'User rejected the request')
          ) {
            throw new Error('User rejected the request');
          } else {
            throw new Error('Failed to setup the network');
          }
        }
      }

      if (
        error.code === 4001 ||
        (error instanceof Error &&
          error.message === 'User rejected the request')
      ) {
        throw new Error('User rejected the request');
      } else {
        throw new Error('Failed to setup the network');
      }
    }
  }
  return false;
};
