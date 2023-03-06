import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ChakraProvider, Button } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import type { AppProps } from 'next/app';
import * as React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { WagmiConfig } from 'wagmi';
import { chains, client } from '../wagmi';
import { createClient, Provider as UrqlProvider } from 'urql';
import '../styles.css'

const urqlClient = createClient({
  // url: 'https://api.thegraph.com/subgraphs/name/ameensol/privacy-pools'
  url: 'https://api.thegraph.com/subgraphs/name/dan13ram/pools-optimism-goerli'
});

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <UrqlProvider value={urqlClient}>
      <WagmiConfig client={client}>
        <RainbowKitProvider
          chains={chains}
          modalSize="wide"
          showRecentTransactions={true}
        >
          <ChakraProvider>
            {mounted && <Component {...pageProps} />}
            <Toaster position="bottom-center">
              {(t) => (
                <ToastBar toast={t}>
                  {({ icon, message }) => (
                    <>
                      {icon}
                      {message}
                      {t.type !== 'loading' && (
                        <Button
                          colorScheme="red"
                          variant="ghost"
                          size="xs"
                          onClick={() => toast.dismiss(t.id)}
                        >
                          <CloseIcon />
                        </Button>
                      )}
                    </>
                  )}
                </ToastBar>
              )}
            </Toaster>
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </UrqlProvider>
  );
}

export default App;
