import {
  Button,
  Center,
  Container,
  HStack,
  Link,
  Stack,
  Text,
  Tooltip,
  VStack,
  Select,
  Spinner
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { NoteWalletConnectButton } from '../components/NoteWallet/NoteWalletConnectButton';

import { hexZeroPad, parseEther, isAddress } from 'ethers/lib/utils';
import {
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractReads,
  useBalance
} from 'wagmi';
import { useAtom } from 'jotai';
import { DappLayout } from '../components';
import { NoteWallet } from '../components/NoteWallet';
import { assetAtom, denominationAtom } from '../state/atoms';
import { useNote, useContractAddress, useOptions } from '../hooks';
import { privacyPoolABI } from '../constants';
import { pinchString } from '../utils';

function Page() {
  const [asset, setAsset] = useAtom(assetAtom);
  const [denomination, setDenomination] = useAtom(denominationAtom);

  const { assetOptions, denominationOptions } = useOptions();
  const { chain } = useNetwork();
  const { commitment } = useNote();
  const { contractAddress } = useContractAddress();
  const addRecentTransaction = useAddRecentTransaction();

  const {
    data: poolData,
    isError: isPoolDataError,
    isLoading: isPoolDataLoading
  } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: privacyPoolABI,
        functionName: 'getLatestRoot'
      },
      {
        address: contractAddress,
        abi: privacyPoolABI,
        functionName: 'currentLeafIndex'
      }
    ],
    enabled: typeof chain?.id === 'number' && isAddress(contractAddress)
  });

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError
  } = useBalance({
    address: contractAddress as `0x${string}`,
    enabled: typeof chain?.id === 'number' && isAddress(contractAddress)
  });

  const { config, isError: isPrepareError } = usePrepareContractWrite({
    address: contractAddress,
    abi: privacyPoolABI,
    functionName: 'deposit',
    args: [hexZeroPad(commitment.toHexString(), 32)],
    enabled:
      Boolean(!commitment.eq(0)) &&
      typeof chain?.id === 'number' &&
      isAddress(contractAddress),
    overrides: {
      value: parseEther(denomination as string),
      gasPrice: parseEther('0.00000000001')
    },
    onError() {
      toast.error('There was an error preparing the transaction.', {
        duration: 1000
      });
    }
  });

  const { data, write } = useContractWrite({
    ...config,
    onError() {
      toast.error('Failed to send transaction.');
    }
  });

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      addRecentTransaction({
        hash: data!.hash,
        description: 'Deposit'
      });
      toast.success(
        <HStack w="full" justify="space-evenly">
          <VStack>
            <Text color="green.600">Deposit succeeded!</Text>
            <Link
              w="full"
              as={NextLink}
              isExternal
              href={`${chain?.blockExplorers?.default.url}/tx/${data?.hash}`}
            >
              <Text color="gray.800">
                View on Etherscan <ExternalLinkIcon mx="2px" color="blue.600" />
              </Text>
            </Link>
          </VStack>
        </HStack>,
        { duration: 10000, style: { width: '100%' } }
      );
    }
  });

  const isDepositDisabled = Boolean(
    isPrepareError || !write || isLoading || Boolean(commitment.eq(0))
  );

  return (
    <DappLayout title="Deposit | Privacy 2.0">
      <Container maxW="100vw" minW="216px" h="100vh">
        <Container
          bg="black"
          px={0}
          pb={4}
          my={8}
          borderRadius={10}
          boxShadow="2xl"
        >
          <VStack
            w="full"
            borderRadius={10}
            borderBottomRadius={0}
            bg="white"
            p={4}
          >
            <HStack>
              <Tooltip
                label={`Amount of asset to deposit. Higher denomination pools may take longer to gather large anonymity sets.`}
              >
                <QuestionOutlineIcon />
              </Tooltip>
              <Text fontSize="md">Value</Text>
            </HStack>

            <Container p={0}>
              <HStack w="full">
                <Select
                  size="md"
                  bg="gray.50"
                  onChange={(e) => setDenomination(e.target.value)}
                  defaultValue={denomination}
                >
                  {denominationOptions.map((_denomination, i) => (
                    <option
                      value={_denomination}
                      key={`${_denomination}-${i}-option`}
                    >
                      {_denomination.toString()}
                    </option>
                  ))}
                </Select>
                <Select
                  size="md"
                  bg="gray.50"
                  onChange={(e) => setAsset(e.target.value)}
                  defaultValue={asset}
                >
                  {assetOptions.map((_asset, i) => (
                    <option value={_asset} key={`${_asset}-${i}-option`}>
                      {_asset.toString()}
                    </option>
                  ))}
                </Select>
              </HStack>
            </Container>

            <HStack w="full" justify="space-between" py={2}>
              <VStack>
                <HStack>
                  <Tooltip
                    label={`The current number of deposits that have joined the pool. Higher is better!`}
                  >
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text fontSize="md">Pool Size</Text>
                </HStack>
                <Text fontWeight="bold">
                  {isPoolDataLoading ? (
                    <Spinner />
                  ) : isPoolDataError ? (
                    '--'
                  ) : (
                    (
                      ((poolData as [string, BigInt]) || [null, null])[1] || 0
                    ).toString()
                  )}
                </Text>
              </VStack>
              <VStack>
                <HStack>
                  <Tooltip
                    label={`The commitment is publicly recorded in the privacy pool.`}
                  >
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text fontSize="md">Commitment</Text>
                </HStack>

                <Tooltip label={hexZeroPad(commitment.toHexString(), 32)}>
                  <Text
                    fontSize="lg"
                    sx={{ wordBreak: 'break-word' }}
                    fontWeight="bold"
                    _hover={{ color: 'gray.500' }}
                  >
                    {pinchString(hexZeroPad(commitment.toHexString(), 32), 6)}
                  </Text>
                </Tooltip>
              </VStack>
            </HStack>

            <HStack w="full" justify="space-between" py={2}>
              <VStack>
                <HStack>
                  <Tooltip
                    label={`The current balance of the pool. Fluctuates depending on how many depositors are waiting to withdraw.`}
                  >
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text fontSize="md">Pool Balance</Text>
                </HStack>
                <Text fontWeight="bold">
                  {isBalanceLoading ? (
                    <Spinner />
                  ) : isBalanceError ? (
                    '--'
                  ) : (
                    balanceData?.formatted
                  )}
                  {balanceData?.symbol === asset
                    ? ` ${asset}`
                    : ` ${balanceData?.symbol} (${asset})`}
                </Text>
              </VStack>
              <VStack>
                <HStack>
                  <Tooltip
                    label={`The current merkle root of deposits that have joined the pool. Used in zero knowledge to prove that the commitment is deposited in the pool.`}
                  >
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text fontSize="md">Root</Text>
                </HStack>
                <Tooltip
                  label={((poolData as [string, BigInt]) || [null, null])[0]}
                >
                  <Text
                    fontSize="lg"
                    sx={{ wordBreak: 'break-word' }}
                    fontWeight="bold"
                    _hover={{ color: 'gray.500' }}
                  >
                    {isPoolDataLoading ? (
                      <Spinner />
                    ) : isPoolDataError ? (
                      '--'
                    ) : (
                      pinchString(
                        (
                          ((poolData as [string, BigInt]) || [null, null])[0] ||
                          0
                        ).toString(),
                        6
                      )
                    )}
                  </Text>
                </Tooltip>
              </VStack>
            </HStack>
          </VStack>

          {asset !== 'ETH' ? (
            <>
              <Stack>
                <Center h="100%" pl={4}>
                  <Button
                    colorScheme="pink"
                    size="lg"
                    w="full"
                    isDisabled={!Boolean(contractAddress)}
                  >
                    Approve
                  </Button>
                </Center>
              </Stack>

              <Stack>
                <Center h="100%" pr={4}>
                  <Button
                    bg="gray.200"
                    color="black"
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: 'gray.700',
                      color: 'white',
                      borderColor: 'gray.600',
                      transform: 'scaleX(1.01)'
                    }}
                    size="lg"
                    w="full"
                    isDisabled={!Boolean(contractAddress)}
                  >
                    Deposit
                  </Button>
                </Center>
              </Stack>
            </>
          ) : (
            <Stack>
              <Center h="100%" pt={4} px={4}>
                {commitment.eq(0) ? (
                  <Text color="white" fontSize="lg" fontWeight="bold">
                    Connect your Note Wallet
                  </Text>
                ) : (
                  <Button
                    bg="gray.100"
                    color="black"
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: 'white',
                      color: 'black',
                      borderColor: 'gray.600',
                      transform: 'scaleX(1.05)'
                    }}
                    size="lg"
                    w="50%"
                    isDisabled={isDepositDisabled}
                    onClick={() => {
                      write?.({
                        overrides: {
                          value: parseEther(denomination)
                        }
                      } as any);
                    }}
                  >
                    {isLoading ? <Spinner /> : 'Deposit'}
                  </Button>
                )}
              </Center>
            </Stack>
          )}
        </Container>
      </Container>
    </DappLayout>
  );
}

export default Page;
