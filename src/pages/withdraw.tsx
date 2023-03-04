import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  VStack,
  Input,
  Link,
  Select,
  Stack,
  Text,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Th,
  Tr,
  Tbody,
  Tfoot,
  Td,
  Tooltip,
  Spinner
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  QuestionOutlineIcon,
  NotAllowedIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import NextLink from 'next/link';
import {
  hexZeroPad,
  parseEther,
  formatEther,
  getAddress,
  isAddress
} from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import { groth16 } from 'snarkjs';
import { hashMod, subsetDataToBytes } from 'pools-ts';
import {
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { useAtom } from 'jotai';
import { DappLayout, NoteWalletConnectButton, SubsetMakerButton } from '../components';
import {
  assetAtom,
  denominationAtom,
  relayerAtom,
  recipientAtom,
  feeAtom,
  zkProofAtom,
  spentNullifiersAtom,
  subsetRootAtom
} from '../state';
import {
  useNote,
  useContractAddress,
  useCommitments,
  useAccessList,
  useSubsetRoots,
  useExistingCommitments,
  useDepositsTree,
  useZKeys,
  useOptions
} from '../hooks';
import { subsetRegistryABI } from '../constants';
import { growShrinkProps, pinchString, isDecimalNumber } from '../utils';

function Page() {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState<boolean>(true);
  const [isDepositsCollapsed, setIsDepositsCollapsed] = useState<boolean>(true);

  const [asset, setAsset] = useAtom(assetAtom);
  const [denomination, setDenomination] = useAtom(denominationAtom);
  const [leafIndex, setLeafIndex] = useState(NaN);
  const [relayer, setRelayer] = useAtom(relayerAtom);
  const [recipient, setRecipient] = useAtom(recipientAtom);
  const [fee, setFee] = useAtom(feeAtom);
  const [zkProof, setZkProof] = useAtom(zkProofAtom);
  const [spentNullifiers] = useAtom(spentNullifiersAtom);
  const [subsetRoot] = useAtom(subsetRootAtom);

  const { assetOptions, denominationOptions } = useOptions();
  const { chain } = useNetwork();
  const { commitment, secret } = useNote();
  const { contractAddress, subsetRegistry } = useContractAddress();
  const { depositsTree } = useDepositsTree();
  const { subsetRoots } = useSubsetRoots();
  const { accessList } = useAccessList();
  const { executeCommitmentsQuery } = useCommitments();
  const { existingCommitments, leafIndexToIndex } = useExistingCommitments();
  const { zkeyBytes, wasmBytes } = useZKeys();
  const addRecentTransaction = useAddRecentTransaction();

  const nullifier =
    isNaN(leafIndex) ||
    existingCommitments.length === 0 ||
    typeof leafIndexToIndex[leafIndex] === 'undefined'
      ? '0x0000000000000000000000000000000000000000000000000000000000000000'
      : existingCommitments[leafIndexToIndex[leafIndex]].nullifier;

  const numSpentDeposits = existingCommitments.filter(
    ({ nullifier }) => spentNullifiers[nullifier]
  ).length;

  useEffect(() => {
    if (
      (isNaN(leafIndex) ||
        typeof leafIndexToIndex[leafIndex] === 'undefined') &&
      existingCommitments.length > 0 &&
      subsetRoots.length > 0 &&
      subsetRoots.length === Object.keys(spentNullifiers).length
    ) {
      for (let i = 0; i < existingCommitments.length; i++) {
        if (
          !Boolean(
            spentNullifiers[hexZeroPad(existingCommitments[i].nullifier, 32)]
          )
        ) {
          setLeafIndex(Number(existingCommitments[i].leafIndex.toString()));
          break;
        }
      }
      setLeafIndex(Number(existingCommitments[0].leafIndex.toString()));
    } else if (
      (isNaN(leafIndex) ||
        typeof leafIndexToIndex[leafIndex] === 'undefined') &&
      existingCommitments.length > 0 &&
      subsetRoots.length === 0
    ) {
      setLeafIndex(Number(existingCommitments[0].leafIndex.toString()));
    }
  }, [
    subsetRoots,
    leafIndexToIndex,
    leafIndex,
    existingCommitments,
    spentNullifiers
  ]);

  const { config, isError: isPrepareError } = usePrepareContractWrite({
    address: subsetRegistry,
    abi: subsetRegistryABI,
    functionName: 'withdrawAndRecord',
    args: [
      contractAddress || null,
      zkProof?.metadata.accessType === 'blocklist' ||
      zkProof?.metadata.accessType === 'allowlist'
        ? zkProof.metadata.accessType === 'blocklist'
          ? 1
          : 2
        : null,
      zkProof?.metadata.bitLength || null,
      zkProof?.metadata.bytesData?.data || null,
      (zkProof?.solidityInput?.flatProof?.length || 0) === 8
        ? zkProof?.solidityInput.flatProof
        : null,
      zkProof?.solidityInput?.root || null,
      zkProof?.solidityInput?.subsetRoot || null,
      zkProof?.solidityInput?.nullifier || null,
      zkProof?.solidityInput?.recipient || null,
      zkProof?.solidityInput?.relayer || null,
      zkProof?.solidityInput?.fee || null
    ],
    overrides: {
      gasPrice: parseEther('0.00000000001')
    },
    enabled: Boolean(
      Boolean(zkProof) &&
        isAddress(zkProof!.metadata.contractAddress) &&
        isAddress(contractAddress) &&
        Boolean(
          getAddress(zkProof!.metadata.contractAddress) ===
            getAddress(contractAddress)
        ) &&
        zkProof!.metadata.chainId === chain?.id
    ),
    onError() {
      toast.error('There was an error preparing the transaction.');
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
        description: 'Withdraw'
      });
      setZkProof(null);
      toast.success(
        <HStack w="full" justify="space-evenly">
          <VStack>
            <Text color="green.600">Withdraw succeeded!</Text>
            <Link
              w="full"
              as={NextLink}
              isExternal
              href={`${chain?.blockExplorers?.default.url}/tx/${data?.hash}`}
            >
              <Text color="blue.600">
                View on Etherscan <ExternalLinkIcon mx="2px" color="blue.600" />
              </Text>
            </Link>
          </VStack>
        </HStack>,
        { duration: 30000, style: { width: '100%' } }
      );
    }
  });

  const isNullifierInvalid =
    Boolean(spentNullifiers[nullifier]) || BigNumber.from(nullifier).eq(0);
  const isRecipientInvalid = !recipient
    ? false
    : !isAddress(recipient) || Boolean(getAddress(recipient) === AddressZero);
  const isRelayerInvalid = !isAddress(relayer)
    ? false
    : Boolean(getAddress(relayer) === AddressZero);
  const isFeeInvalid =
    !fee || Number(fee) === 0
      ? false
      : !isDecimalNumber(fee) ||
        Boolean(parseEther(fee).gte(parseEther(denomination)));
  const isWithdrawDisabled = Boolean(
    !zkProof ||
      !write ||
      isPrepareError ||
      isLoading ||
      existingCommitments.length === 0
  );
  const isGenerateProofDisabled = Boolean(
    isNullifierInvalid ||
      isRecipientInvalid ||
      isRelayerInvalid ||
      isFeeInvalid ||
      !depositsTree ||
      !accessList ||
      !secret ||
      !nullifier ||
      !recipient ||
      !relayer ||
      !fee ||
      isFeeInvalid
  );

  const generateZkProof = async () => {
    if (
      isNullifierInvalid ||
      isRecipientInvalid ||
      isRelayerInvalid ||
      isFeeInvalid ||
      !secret ||
      !nullifier ||
      (!leafIndex && leafIndex !== 0) ||
      depositsTree.length === 0 ||
      accessList.length === 0 ||
      zkeyBytes.data.length === 0 ||
      wasmBytes.data.length === 0
    )
      return;
    try {
      const { siblings: mainProof } = depositsTree.generateProof(leafIndex);
      const { siblings: subsetProof } = accessList.generateProof(leafIndex);
      const message = hashMod(
        ['address', 'address', 'uint256'],
        [recipient, relayer, parseEther(fee)]
      );
      const input = {
        root: depositsTree.root.toHexString(),
        subsetRoot: accessList.root.toHexString(),
        nullifier,
        message: message.toHexString(),
        secret: secret.toHexString(),
        path: leafIndex,
        mainProof: mainProof.map((b) => b.toHexString()),
        subsetProof: subsetProof.map((b) => b.toHexString())
      };
      const { proof, publicSignals } = await groth16.fullProve(
        input,
        wasmBytes,
        zkeyBytes
      );
      const solidityInput = {
        flatProof: [
          proof.pi_a[0],
          proof.pi_a[1],
          proof.pi_b[0][1],
          proof.pi_b[0][0],
          proof.pi_b[1][1],
          proof.pi_b[1][0],
          proof.pi_c[0],
          proof.pi_c[1]
        ],
        root: hexZeroPad(BigNumber.from(input.root).toHexString(), 32),
        subsetRoot: hexZeroPad(
          BigNumber.from(input.subsetRoot).toHexString(),
          32
        ),
        nullifier: hexZeroPad(
          BigNumber.from(input.nullifier).toHexString(),
          32
        ),
        recipient: getAddress(recipient).toString(),
        relayer: getAddress(relayer).toString(),
        fee: parseEther(fee).toString()
      };
      const bytesData = subsetDataToBytes(accessList.subsetData);
      setZkProof({
        proof,
        publicSignals,
        solidityInput,
        metadata: {
          contractAddress,
          asset,
          denomination,
          chainId: chain!.id,
          accessType: 'blocklist',
          bitLength: accessList.length,
          subsetData: accessList.subsetData,
          bytesData
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DappLayout title="Withdraw | Privacy 2.0">
      <Container maxW="98vw" minW="216px">
        <Container
          bg="black"
          px={0}
          my={8}
          mb={4}
          borderRadius={10}
          boxShadow="2xl"
        >
          {zkProof && zkProof.proof.pi_a.length > 0 ? (
            <Center>
              <VStack w="full">
                <Stack
                  w="full"
                  px={4}
                  pt={3}
                  pb={5}
                  borderRadius={10}
                  borderBottomRadius={0}
                  bg="white"
                >
                  <HStack>
                    <Tooltip
                      label={`Amount of ${zkProof.metadata.asset} that the recipient address will receive.`}
                    >
                      <QuestionOutlineIcon />
                    </Tooltip>
                    <Text fontSize="md">Value</Text>
                  </HStack>
                  <Text fontWeight="bold" fontSize="lg">
                    {BigNumber.from(zkProof.solidityInput.fee).lt(
                      parseEther(zkProof.metadata.denomination)
                    )
                      ? formatEther(
                          parseEther(zkProof.metadata.denomination).sub(
                            zkProof.solidityInput.fee
                          )
                        )
                      : zkProof.metadata.denomination}{' '}
                    {zkProof.metadata.asset}
                  </Text>
                  <HStack>
                    <Tooltip
                      label={`The recipient address should be a brand new Ethereum address with no activity at all. This is a new, unlinked address.`}
                    >
                      <QuestionOutlineIcon />
                    </Tooltip>
                    <Text fontSize="md">Recipient</Text>
                  </HStack>
                  <Text
                    bg="gray.50"
                    borderRadius={6}
                    p={2}
                    px={4}
                    border="solid 1px rgba(42, 42, 42, 0.25)"
                    fontWeight="bold"
                    fontSize="md"
                    wordBreak="break-word"
                  >
                    {zkProof.solidityInput.recipient}
                  </Text>

                  <Button
                    onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
                    size="sm"
                    variant="outline"
                  >
                    <Text fontWeight="normal" fontSize="xs">
                      {isDetailsCollapsed ? 'Show Details' : 'Hide Details'}
                    </Text>
                  </Button>

                  {!isDetailsCollapsed && (
                    <>
                      <HStack>
                        <Tooltip
                          label={`The relayer is a funded address that pays the Ethereum gas costs for the withdrawal transaction.`}
                        >
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text fontSize="md">Relayer</Text>
                      </HStack>
                      <Text
                        bg="gray.50"
                        borderRadius={6}
                        p={2}
                        px={4}
                        border="solid 1px rgba(42, 42, 42, 0.25)"
                        fontWeight="bold"
                        fontSize="md"
                        wordBreak="break-word"
                      >
                        {zkProof.solidityInput.relayer}
                      </Text>
                      <HStack>
                        <Tooltip
                          label={`The fee gets paid to the relayer. It is taken from the withdrawal.`}
                        >
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text fontSize="md">Fee</Text>
                      </HStack>
                      <Text
                        bg="gray.50"
                        borderRadius={6}
                        p={2}
                        px={4}
                        border="solid 1px rgba(42, 42, 42, 0.25)"
                        fontWeight="bold"
                        fontSize="md"
                      >
                        {formatEther(zkProof.solidityInput.fee)}{' '}
                        {zkProof.metadata.asset}
                      </Text>

                      <HStack>
                        <Tooltip label="The nullifier is calculated from the index of the commitment in the tree and the secret. The nullifier prevents double spends.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Nullifier</Text>
                      </HStack>
                      <Text
                        bg="gray.50"
                        borderRadius={6}
                        p={2}
                        px={4}
                        border="solid 1px rgba(42, 42, 42, 0.25)"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        {zkProof.solidityInput.nullifier}
                      </Text>

                      <HStack w="full">
                        <Tooltip label="The subset root is calculated from the subset of deposits associated with the withdrawal. This value represents either a block list or an allow list. Click `Create Subset` to change this value.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Root</Text>
                      </HStack>
                      <Text
                        bg="gray.50"
                        borderRadius={6}
                        p={2}
                        px={4}
                        border="solid 1px rgba(42, 42, 42, 0.25)"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        {zkProof.solidityInput.root}
                      </Text>

                      <HStack w="full">
                        <Tooltip label="The subset root is calculated from the subset of deposits associated with the withdrawal. This value represents either a block list or an allow list. Click `Create Subset` to change this value.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Subset Root</Text>
                      </HStack>
                      <Text
                        bg="gray.50"
                        borderRadius={6}
                        p={2}
                        px={4}
                        border="solid 1px rgba(42, 42, 42, 0.25)"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        {zkProof.solidityInput.subsetRoot}
                      </Text>

                      <HStack>
                        <Tooltip
                          label={`Array of blocked deposits in the subset. For this demo, the subsets are limited to only modify up to 30 of the most recent deposits. A 1 value represents a blocked deposit.`}
                        >
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text fontSize="md">Subset Data</Text>
                      </HStack>
                      <Text
                        bg="gray.50"
                        borderRadius={6}
                        p={2}
                        px={4}
                        border="solid 1px rgba(42, 42, 42, 0.25)"
                        fontWeight="bold"
                        fontSize="md"
                      >
                        {JSON.stringify(
                          zkProof.metadata.subsetData!.length > 30
                            ? zkProof.metadata.subsetData!.slice(
                                zkProof.metadata.subsetData!.length - 30
                              )
                            : zkProof.metadata.subsetData,
                          null,
                          2
                        )}
                      </Text>
                    </>
                  )}
                </Stack>

                <HStack w="full" p={4} pt={2} justify="space-evenly">
                  <Button
                    size="lg"
                    bg="gray.200"
                    _hover={{
                      bg: 'white',
                      color: 'black',
                      borderColor: 'gray.600',
                      transform: 'scaleX(1.01)'
                    }}
                    onClick={() => setZkProof(null)}
                    variant="outline"
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    w="full"
                    size="lg"
                    mx={3}
                    bg="white"
                    color="black"
                    fontSize="lg"
                    fontWeight="bold"
                    _hover={{
                      bg: 'white',
                      color: 'black',
                      borderColor: 'gray.600',
                      transform: 'scaleX(1.01)'
                    }}
                    isDisabled={isWithdrawDisabled}
                    onClick={() => {
                      write?.();
                    }}
                  >
                    {isLoading ? <Spinner /> : 'Withdraw'}
                  </Button>
                </HStack>
              </VStack>
            </Center>
          ) : (
            <>
              <VStack
                bg="white"
                borderRadius={10}
                borderBottomRadius={0}
                p={4}
                w="full"
              >
                <Stack w="full" direction="column" align="flex-start">
                  <VStack w="full">
                    <HStack>
                      <Tooltip label="Amount of asset to withdraw. This value includes any potential fee.">
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
                            <option
                              value={_asset}
                              key={`${_asset}-${i}-option`}
                            >
                              {_asset.toString()}
                            </option>
                          ))}
                        </Select>
                      </HStack>
                    </Container>
                  </VStack>

                  <HStack w="full" justify="space-between" py={2}>
                    <VStack>
                      <HStack>
                        <Tooltip label="The same commitment can be deposited more than once. The leaf index of a commitment is how to distinguish each deposit. Each deposit can only be withdrawn once.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Leaf Index</Text>
                      </HStack>
                      <Select
                        w="fit-content"
                        textAlign="center"
                        size="sm"
                        bg="gray.50"
                        onChange={(e) => setLeafIndex(Number(e.target.value))}
                        defaultValue={leafIndex.toString()}
                      >
                        {existingCommitments.map((commitmentData, i) => (
                          <option
                            value={commitmentData.leafIndex.toString()}
                            key={`${commitmentData.leafIndex.toString()}-${i}-option`}
                            disabled={Boolean(
                              spentNullifiers[existingCommitments[i]?.nullifier]
                            )}
                          >
                            {commitmentData.leafIndex.toString()}
                          </option>
                        ))}
                      </Select>
                    </VStack>

                    <VStack>
                      <HStack>
                        <Tooltip label="The nullifier is calculated from the index of the commitment in the tree and the secret. The nullifier prevents double spends.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text fontSize="md">Nullifier</Text>
                      </HStack>

                      <Tooltip label={nullifier}>
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{
                            color: 'gray.500'
                          }}
                          color={
                            Boolean(
                              spentNullifiers[
                                existingCommitments[leafIndexToIndex[leafIndex]]
                                  ?.nullifier
                              ]
                            )
                              ? 'red'
                              : ''
                          }
                        >
                          {pinchString(`${nullifier}`, 6)}
                        </Text>
                      </Tooltip>
                    </VStack>
                  </HStack>
                </Stack>

                <HStack w="full">
                  <Tooltip label="Recipient will receive the funds from the withdrawal. Use a *brand new* Ethereum address for every withdrawal.">
                    <QuestionOutlineIcon />
                  </Tooltip>
                  <Text fontSize="md">Recipient</Text>
                </HStack>

                <Input
                  bg="gray.50"
                  type="text"
                  size="md"
                  name="recipient"
                  placeholder="(You)"
                  border="solid 1px rgba(200, 200, 200, 0.25)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />

                <Button
                  onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
                  size="sm"
                  variant="outline"
                  w="full"
                >
                  <Text fontWeight="normal" fontSize="xs">
                    {isDetailsCollapsed ? 'Show Details' : 'Hide Details'}
                  </Text>
                </Button>

                {!isDetailsCollapsed && (
                  <>
                    <FormControl
                      w="full"
                      isRequired
                      isInvalid={isRelayerInvalid}
                    >
                      <VStack w="full">
                        <HStack w="full">
                          <Tooltip label="Relayer will be forwarded `fee` units of the withdrawal, if a `fee` value is set to a nonzero value. The zero address is not a valid relayer address.">
                            <QuestionOutlineIcon />
                          </Tooltip>
                          <Text>Relayer</Text>
                        </HStack>
                        <Input
                          bg="gray.50"
                          type="text"
                          name="relayer"
                          placeholder="0x00...dead"
                          value={relayer}
                          onChange={(e) => setRelayer(e.target.value)}
                        />
                      </VStack>
                      <HStack align="center" justify="center">
                        <FormErrorMessage pb={4}>
                          The relayer cannot be the zero address.
                        </FormErrorMessage>
                      </HStack>
                    </FormControl>

                    <FormControl w="full" isRequired isInvalid={isFeeInvalid}>
                      <VStack align="center">
                        <HStack w="full">
                          <Tooltip label="Any nonzero fee is paid to the relayer address. If `fee` is zero, then nothing gets paid to the relayer address.">
                            <QuestionOutlineIcon />
                          </Tooltip>
                          <Text>Fee</Text>
                        </HStack>
                        <Input
                          bg="gray.50"
                          type="text"
                          name="fee"
                          placeholder="0.00"
                          value={fee}
                          onChange={(e) => setFee(e.target.value)}
                        />
                      </VStack>
                      <HStack align="center" justify="center">
                        <FormErrorMessage pb={4} px={4}>
                          Invalid fee amount. Must be less than the note
                          denomination and have at most 18 decimals.
                        </FormErrorMessage>
                      </HStack>
                    </FormControl>

                    <FormControl w="full" isRequired>
                      <VStack align="center">
                        <HStack w="full">
                          <Tooltip label="The subset root is calculated from the subset of deposits associated with the withdrawal. This value represents either a block list or an allow list. Click `Create Subset` to change this value.">
                            <QuestionOutlineIcon />
                          </Tooltip>
                          <Text>Root</Text>
                        </HStack>
                        <Input
                          bg="gray.50"
                          readOnly
                          type="text"
                          name="root"
                          placeholder="root (required)"
                          value={depositsTree?.root.toHexString()}
                        />
                      </VStack>
                    </FormControl>

                    <FormControl w="full" isRequired>
                      <VStack align="center">
                        <HStack w="full">
                          <Tooltip label="The subset root is calculated from the subset of deposits associated with the withdrawal. This value represents either a block list or an allow list. Click `Create Subset` to change this value.">
                            <QuestionOutlineIcon />
                          </Tooltip>
                          <Text>Subset Root</Text>
                        </HStack>
                        <Input
                          bg="gray.50"
                          readOnly
                          type="text"
                          name="subsetRoot"
                          placeholder="subsetRoot (required)"
                          value={subsetRoot?.toHexString()}
                        />
                      </VStack>
                    </FormControl>

                    <Stack w="full">
                      <HStack w="full">
                        <Tooltip
                          label={`Array of blocked deposits in the subset. For this demo, the subsets are limited to only modify up to 30 of the most recent deposits. A 1 value represents a blocked deposit.`}
                        >
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text fontSize="md">Subset Data</Text>
                      </HStack>
                      <Input
                        bg="gray.50"
                        readOnly
                        type="text"
                        name="subsetData"
                        placeholder="subsetData (required)"
                        value={JSON.stringify(
                          accessList.subsetData!.length > 30
                            ? accessList.subsetData!.slice(
                                accessList.subsetData!.length - 30
                              )
                            : accessList.subsetData,
                          null,
                          2
                        )}
                      />
                    </Stack>
                  </>
                )}
              </VStack>

              <Stack
                direction={['column', 'row']}
                align="center"
                justify="center"
                p={4}
              >
                {commitment.eq(0) ? (
                  <NoteWalletConnectButton />
                ) : (
                  <>
                    <SubsetMakerButton />

                    <Button
                      w={['75%', '50%']}
                      mx={2}
                      bg="white"
                      color="black"
                      fontSize="lg"
                      fontWeight="bold"
                      _hover={{
                        bg: 'white',
                        color: 'black',
                        borderColor: 'gray.600',
                        transform: 'scaleX(1.05)'
                      }}
                      isDisabled={isGenerateProofDisabled}
                      onClick={generateZkProof}
                      variant="outline"
                    >
                      Generate Proof
                    </Button>
                  </>
                )}
              </Stack>
            </>
          )}
        </Container>

        {!commitment.eq(0) && (
          <Container centerContent minW="216px" maxW="960px" mb={40} px={0}>
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mt={4}
              p={4}
              w="full"
              bg="gray.100"
              border="solid 1px #BEE3F8"
              borderBottom="none"
              borderRadius="8px 8px 0 0"
            >
              <Heading color="gray.700" size="sm">
                Your Deposits
              </Heading>

              {numSpentDeposits > 0 ? (
                <HStack>
                  <Text
                    fontWeight="bold"
                    color="gray.700"
                    fontSize="sm"
                    p={1}
                    borderRadius={8}
                  >
                    Claimable: {existingCommitments.length - numSpentDeposits}
                  </Text>
                  <Text
                    fontWeight="bold"
                    color="gray.700"
                    fontSize="sm"
                    p={1}
                    borderRadius={8}
                  >
                    Total: {existingCommitments?.length}
                  </Text>
                  <Button
                    onClick={() => {
                      setIsFetching(true);
                      executeCommitmentsQuery();
                      setTimeout(() => setIsFetching(false), 15000);
                    }}
                    isDisabled={isFetching}
                    p={0}
                  >
                    <RepeatIcon />
                  </Button>
                </HStack>
              ) : (
                <HStack>
                  <Text
                    fontWeight="bold"
                    color="gray.700"
                    fontSize="sm"
                    p={1}
                    borderRadius={8}
                  >
                    Claimable: {existingCommitments?.length}
                  </Text>
                  <Text
                    fontWeight="bold"
                    color="blue.700"
                    fontSize="sm"
                    bg="gray.100"
                    p={1}
                    borderRadius={8}
                  >
                    Total: {existingCommitments?.length}
                  </Text>
                </HStack>
              )}
            </Stack>

            <Stack
              w="full"
              bg="gray.50"
              border="solid 1px #BEE3F8"
              borderTop="none"
              borderRadius="0 0 8px 8px"
              p={1}
            >
              {BigNumber.from(nullifier).eq(0) ? (
                <Stack>
                  <Center h="100%" p={4}>
                    <Text
                      color="blue.900"
                      fontWeight="bold"
                      whiteSpace="pre-wrap"
                      textAlign="center"
                    >
                      {!commitment.eq(0)
                        ? 'No deposits detected for this commitment.\nRecent deposits may take some time to appear.'
                        : 'Unlock your note wallet.'}
                    </Text>
                  </Center>
                </Stack>
              ) : (
                <>
                  <Stack align="center" py={2} px={2}>
                    <Button
                      w="full"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setIsDepositsCollapsed(!isDepositsCollapsed)
                      }
                    >
                      <Text fontWeight="normal" fontSize="xs">
                        {isDepositsCollapsed
                          ? 'Show Deposits'
                          : 'Hide Deposits'}
                      </Text>
                    </Button>
                  </Stack>
                  {!isDepositsCollapsed && (
                    <>
                      <Center>
                        <VStack align="flex-start" px={4} w="80%">
                          <Text
                            color="blue.600"
                            borderRadius={8}
                            fontWeight="bold"
                            fontSize="xs"
                          >
                            COMMITMENT
                          </Text>
                          <Text
                            color="blue.900"
                            fontWeight="normal"
                            wordBreak="break-word"
                          >
                            {pinchString(commitment.toHexString(), [8, 16])}
                          </Text>
                        </VStack>
                      </Center>
                      <TableContainer
                        whiteSpace="unset"
                        maxH="98vh"
                        overflowY="auto"
                        p={2}
                        w="full"
                      >
                        <Table variant="simple" size="md" colorScheme="blue">
                          <TableCaption>
                            Your Spent and Unspent Notes in {contractAddress}
                          </TableCaption>
                          <Thead>
                            <Tr w="100%">
                              <Th w="6.25%">
                                <Text color="blue.600">#</Text>
                              </Th>
                              <Th w="6.25%">
                                <Text color="blue.600">Claimable</Text>
                              </Th>
                              <Th w="21.5%">
                                <HStack>
                                  <Text color="blue.600">Sender</Text>
                                  <Text
                                    color="green.700"
                                    bg="teal.100"
                                    borderRadius={8}
                                    p={1}
                                  >
                                    address
                                  </Text>
                                </HStack>
                              </Th>
                              <Th w="33%">
                                <HStack>
                                  <Text color="blue.600">Nullifier</Text>
                                  <Text
                                    color="purple.700"
                                    bg="blue.100"
                                    borderRadius={8}
                                    p={1}
                                  >
                                    bytes32
                                  </Text>
                                </HStack>
                              </Th>
                            </Tr>
                          </Thead>

                          <Tbody>
                            {existingCommitments.length > 0 &&
                              existingCommitments.map(
                                ({ leafIndex, sender, nullifier }, i) => (
                                  <Tr key={`row-${leafIndex}`} w="full">
                                    <Td w="6.25%">
                                      <Text color="blue.900">{leafIndex}</Text>
                                    </Td>
                                    <Td w="6.25%">
                                      {!Boolean(spentNullifiers[nullifier]) ? (
                                        <CheckCircleIcon color="green.400" />
                                      ) : (
                                        <NotAllowedIcon color="red.400" />
                                      )}
                                    </Td>
                                    <Td w="21.5%" wordBreak="break-all">
                                      <Container p={0}>
                                        <Link
                                          w="full"
                                          as={NextLink}
                                          {...growShrinkProps}
                                          href={`${chain?.blockExplorers?.default.url}/address/${sender}`}
                                          isExternal
                                        >
                                          <Text
                                            key={`sender-${leafIndex}`}
                                            color="blue.700"
                                            fontSize="sm"
                                            textAlign="left"
                                            {...growShrinkProps}
                                          >
                                            {pinchString(
                                              sender.toString(),
                                              [4, 6]
                                            )}{' '}
                                            <ExternalLinkIcon />
                                          </Text>
                                        </Link>
                                      </Container>
                                    </Td>
                                    <Td w="33%" wordBreak="break-all">
                                      <Text color="blue.900">
                                        {pinchString(nullifier, [8, 16])}
                                      </Text>
                                    </Td>
                                  </Tr>
                                )
                              )}
                          </Tbody>

                          <Tfoot>
                            <Tr w="100%">
                              <Th w="6.25%">
                                <Text color="blue.600">#</Text>
                              </Th>
                              <Th w="6.25%">
                                <Text color="blue.600">Claimable</Text>
                              </Th>
                              <Th w="21.5%">
                                <HStack>
                                  <Text color="blue.600">Sender</Text>
                                  <Text
                                    color="green.700"
                                    bg="teal.100"
                                    borderRadius={8}
                                    p={1}
                                  >
                                    address
                                  </Text>
                                </HStack>
                              </Th>
                              <Th w="33%">
                                <HStack>
                                  <Text color="blue.600">Nullifier</Text>
                                  <Text
                                    color="purple.700"
                                    bg="blue.100"
                                    borderRadius={8}
                                    p={1}
                                  >
                                    bytes32
                                  </Text>
                                </HStack>
                              </Th>
                            </Tr>
                          </Tfoot>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Container>
        )}
      </Container>
    </DappLayout>
  );
}

export default Page;
