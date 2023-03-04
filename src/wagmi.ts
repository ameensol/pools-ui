import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rainbowWallet,
  ledgerWallet,
  injectedWallet
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient } from 'wagmi';
import { optimismGoerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, provider, webSocketProvider } = configureChains(
  [optimismGoerli],
  [
    alchemyProvider({ apiKey: 'z9BSR-8Q26RfEqwU4D3_BJT_eOSI80yf' }),
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains }),
      rainbowWallet({ chains }),
      coinbaseWallet({ appName: 'privacy-pools', chains }),
      ledgerWallet({ chains }),
      walletConnectWallet({ chains })
    ]
  }
]);

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
});

export { chains };
