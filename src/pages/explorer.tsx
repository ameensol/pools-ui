import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  HStack,
  VStack,
  Text,
  Link,
  Tooltip
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  ViewIcon,
  QuestionOutlineIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useNetwork } from 'wagmi';
import { useAtom } from 'jotai';
import { DappLayout, AssetDenominationBar } from '../components';
import { useSubsetRoots, useExplorerData } from '../hooks';
import { recentWithdrawalAtom } from '../state';
import { growShrinkProps, pinchString } from '../utils';

function Page() {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isWithdrawalsCollapsed, setIsWithdrawalsCollapsed] =
    useState<boolean>(false);
  const [isInfoCollapsed, setIsInfoCollapsed] = useState<boolean>(false);
  const [isIncludedDepositsCollapsed, setIsIncludedDepositsCollapsed] =
    useState<boolean>(true);
  const [isExcludedDepositsCollapsed, setIsExcludedDepositsCollapsed] =
    useState<boolean>(true);

  const [recentWithdrawal, setRecentWithdrawal] = useAtom(recentWithdrawalAtom);

  const { chain } = useNetwork();
  const { subsetRoots, executeSubsetRootsQuery } = useSubsetRoots();
  const { accessList, includedDeposits, excludedDeposits } = useExplorerData();

  return (
    <DappLayout title="Stats | Privacy 2.0">
      <Box pb="8rem">
        <Container my={8} py={8} minW="216px" maxW="960px">
          <VStack bg="gray.50" boxShadow="xl" borderRadius={8}>
            <HStack w="full" bg="gray.200" borderRadius="8px 8px 0 0" p={4}>
              <Text color="black" fontWeight="bold">
                Choose a pool
              </Text>
            </HStack>

            <HStack w="full" justify="center" pb={2}>
              <AssetDenominationBar />
            </HStack>
          </VStack>
        </Container>

        <Container centerContent minW="216px" maxW="960px" py={15} my={5}>
          <Stack
            direction="row"
            w="full"
            justify="space-between"
            align="center"
            bg="gray.200"
            p={4}
            borderBottom="none"
            borderRadius="8px 8px 0 0"
            boxShadow="2xl"
          >
            <Heading color="black" size="sm">
              Recent Withdrawals
            </Heading>

            <HStack>
              <Text fontWeight="bold" color="blue.700" fontSize="sm">
                Total: {subsetRoots?.length}
              </Text>
              <Button
                onClick={() => {
                  setIsFetching(true);
                  executeSubsetRootsQuery();
                  setTimeout(() => setIsFetching(false), 7500);
                }}
                isDisabled={isFetching}
                p={0}
              >
                <RepeatIcon />
              </Button>
            </HStack>
          </Stack>

          <Stack
            w="full"
            bg="gray.50"
            borderTop="none"
            borderRadius="0 0 8px 8px"
          >
            {subsetRoots.length === 0 ? (
              <Stack align="center" p={4}>
                <Text color="blue.700" fontSize="sm" fontWeight="bold">
                  No withdrawals detected for this pool.
                </Text>
              </Stack>
            ) : (
              <>
                <Stack align="center" p={4}>
                  <Button
                    w="full"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setIsWithdrawalsCollapsed(!isWithdrawalsCollapsed)
                    }
                  >
                    <Text fontWeight="normal" fontSize="xs">
                      {isWithdrawalsCollapsed
                        ? 'Show Withdrawals'
                        : 'Hide Withdrawls'}
                    </Text>
                  </Button>
                </Stack>

                {!isWithdrawalsCollapsed && (
                  <VStack w="full" px={4} pb={4}>
                    <HStack justify="center" w="full">
                      <Text
                        w="25%"
                        color="blue.600"
                        borderRadius={8}
                        fontWeight="bold"
                        fontSize="xs"
                        textAlign="center"
                      >
                        INSPECT
                      </Text>
                      <Text
                        w="25%"
                        color="blue.600"
                        borderRadius={8}
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        RECIPIENT
                      </Text>
                      <Text
                        w="25%"
                        color="blue.600"
                        borderRadius={8}
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        NULLIFIER
                      </Text>
                      <Text
                        w="25%"
                        color="blue.600"
                        borderRadius={8}
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        SUBSET ROOT
                      </Text>
                    </HStack>

                    <VStack // 3996/1247
                      w="full"
                      minH="240px"
                      overflowY="auto"
                      bg="gray.50"
                      py={4}
                    >
                      {subsetRoots
                        .slice(
                          subsetRoots.length < 30 ? 0 : subsetRoots.length - 30
                        )
                        .map(
                          (
                            { recipient, subsetRoot, nullifier: _nullifier },
                            index
                          ) => (
                            <HStack
                              key={`row-${_nullifier}`}
                              justify="center"
                              w="full"
                              borderTop={index ? 'solid 1px #BEE3F8' : 'none'}
                              pt={4}
                            >
                              <HStack w="25%" justify="center">
                                <Button
                                  size="sm"
                                  bg={
                                    recentWithdrawal.nullifier !== _nullifier
                                      ? 'white'
                                      : 'black'
                                  }
                                  _hover={
                                    recentWithdrawal.nullifier !== _nullifier
                                      ? {
                                          bg: 'gray.200',
                                          color: 'white',
                                          transform: 'scaleX(1.01)'
                                        }
                                      : {}
                                  }
                                  border="2px solid black"
                                  color="white"
                                  onClick={() => {
                                    setRecentWithdrawal({
                                      recipient,
                                      subsetRoot,
                                      nullifier: _nullifier
                                    });
                                  }}
                                >
                                  <ViewIcon
                                    color={
                                      recentWithdrawal.nullifier !== _nullifier
                                        ? 'black'
                                        : 'white'
                                    }
                                  />
                                </Button>
                              </HStack>
                              <HStack w="25%" justify="flex-start">
                                <Link
                                  as={NextLink}
                                  {...growShrinkProps}
                                  href={`${chain?.blockExplorers?.default.url}/address/${recipient}`}
                                  isExternal
                                >
                                  <Text
                                    key={`recipient-${_nullifier}`}
                                    color="blue.700"
                                    fontSize="sm"
                                    textAlign="left"
                                    wordBreak="break-all"
                                    {...growShrinkProps}
                                  >
                                    {pinchString(recipient.toString(), 5)}{' '}
                                    <ExternalLinkIcon />
                                  </Text>
                                </Link>
                              </HStack>

                              <HStack w="25%" justify="flex-start">
                                <Text>{pinchString(_nullifier, 6)}</Text>
                              </HStack>

                              <HStack w="25%" justify="flex-start">
                                <Text>{pinchString(subsetRoot, 6)}</Text>
                              </HStack>
                            </HStack>
                          )
                        )}
                    </VStack>

                    <HStack justify="center" w="full">
                      <Box w="25%" />
                      <HStack w="25%" justify="flex-start">
                        <Text
                          color="green.700"
                          bg="teal.100"
                          borderRadius={8}
                          p={1}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          ADDRESS
                        </Text>
                      </HStack>

                      <HStack w="25%" justify="flex-start">
                        <Text
                          color="purple.700"
                          bg="blue.100"
                          borderRadius={8}
                          p={1}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          BYTES32
                        </Text>
                      </HStack>

                      <HStack w="25%" justify="flex-start">
                        <Text
                          color="purple.700"
                          bg="blue.100"
                          borderRadius={8}
                          p={1}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          BYTES32
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                )}
              </>
            )}
          </Stack>
        </Container>

        { accessList.length >= 0  && (
          <Container centerContent minW="216px" maxW="960px" mb={40}>
            <Stack w="full">
              <Stack
                w="full"
                direction="row"
                justify="space-between"
                align="center"
                bg="gray.100"
                mt={4}
                p={4}
                borderBottom="none"
                borderRadius="8px 8px 0 0"
              >
                <Heading color="blue.700" size="sm">
                  Subset Explorer
                </Heading>

                <Text fontWeight="bold" color="blue.700" fontSize="sm">
                  Total: {accessList.length}
                </Text>
              </Stack>
            </Stack>

            <Stack
              w="full"
              bg="gray.50"
              border="solid 1px #BEE3F8"
              borderTop="none"
              borderRadius="0 0 8px 8px"
              p={4}
            >
              <Stack align="center" p={4}>
                <Button
                  w="full"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsInfoCollapsed(!isInfoCollapsed)}
                >
                  <Text fontWeight="normal" fontSize="xs">
                    {isInfoCollapsed ? 'Show Info' : 'Hide Info'}
                  </Text>
                </Button>
              </Stack>

              {!isInfoCollapsed && (
                <>
                  <HStack justify="center">
                    <HStack>
                      <Tooltip label="The subset data of an access list is valid if the subset root can be computed faithfully. If the root does not match, then the subset data is corrupted.">
                        <QuestionOutlineIcon />
                      </Tooltip>
                      <Text>Verified</Text>
                    </HStack>

                    {recentWithdrawal.subsetRoot ===
                    accessList.root.toHexString() ? (
                      <Text textAlign="center" color="green.600">
                        The subset is valid!
                      </Text>
                    ) : (
                      <Text textAlign="center" color="red.600">
                        The subset is invalid!
                      </Text>
                    )}
                  </HStack>
                  <Stack direction={['column', 'row']}>
                    <VStack w={['full', '50%']} wordBreak="break-word">
                      <HStack>
                        <Tooltip label="The expected subset root was verified in the zero knowledge proof during the withdrawal transaction. This is the real subset root used to withdraw.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Expected Subset Root</Text>
                      </HStack>
                      <HStack
                        bg="gray.50"
                        borderRadius={6}
                        w="full"
                        p={2}
                        flexGrow={1}
                      >
                        <Text fontWeight="bold" fontSize="sm">
                          {recentWithdrawal.subsetRoot}
                        </Text>
                      </HStack>
                    </VStack>
                    <VStack w={['full', '50%']} wordBreak="break-word">
                      <HStack>
                        <Tooltip label="The computed subset root is calculated using off-chain subset data. If the computed subset root matches the expected root, then the subset data is verified.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Computed Subset Root</Text>
                      </HStack>
                      <HStack
                        bg="gray.50"
                        borderRadius={6}
                        flexGrow={1}
                        w="full"
                        p={2}
                      >
                        <Text fontWeight="bold" fontSize="sm">
                          {accessList.root.toHexString()}
                        </Text>
                      </HStack>
                    </VStack>
                  </Stack>
                  <Stack direction={['column', 'row']}>
                    <VStack w={['full', '50%']} wordBreak="break-word">
                      <HStack>
                        <Tooltip label="The recipient received the asset during the withdrawal. The funds could have come from any of the deposits in the included deposits, but it cannot have come from the excluded deposits!">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Recipient</Text>
                      </HStack>
                      <HStack
                        bg="gray.50"
                        borderRadius={6}
                        w="full"
                        p={2}
                        flexGrow="1"
                      >
                        <Text fontWeight="bold" fontSize="sm">
                          {recentWithdrawal.recipient}
                        </Text>
                      </HStack>
                    </VStack>
                    <VStack w={['full', '50%']} wordBreak="break-word">
                      <HStack>
                        <Tooltip label="The nullifier is calculated from the index of the commitment in the tree and the secret. The nullifier prevents double spends and is unique to each withdrawal.">
                          <QuestionOutlineIcon />
                        </Tooltip>
                        <Text>Nullifier</Text>
                      </HStack>
                      <HStack
                        bg="gray.50"
                        borderRadius={6}
                        flexGrow={1}
                        w="full"
                        p={2}
                      >
                        <Text fontWeight="bold" fontSize="sm">
                          {recentWithdrawal.nullifier}
                        </Text>
                      </HStack>
                    </VStack>
                  </Stack>
                </>
              )}

              {recentWithdrawal.subsetRoot ===
                accessList.root.toHexString() && (
                <>
                  <HStack justify="space-between" align="center" pt={4}>
                    <HStack>
                      <Tooltip label="The withdrawal is cryptographically verified to have originated from one of these deposits.">
                        <QuestionOutlineIcon />
                      </Tooltip>
                      <Heading color="blue.700" size="sm">
                        Included Deposits
                      </Heading>
                    </HStack>

                    <Text fontWeight="bold" color="blue.700" fontSize="sm">
                      Total: {includedDeposits.length}
                    </Text>
                  </HStack>

                  <Stack align="center" p={4}>
                    <Button
                      w="full"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setIsIncludedDepositsCollapsed(
                          !isIncludedDepositsCollapsed
                        )
                      }
                    >
                      <Text fontWeight="normal" fontSize="xs">
                        {isIncludedDepositsCollapsed
                          ? 'Show Included Deposits'
                          : 'Hide Included Deposits'}
                      </Text>
                    </Button>
                  </Stack>

                  {!isIncludedDepositsCollapsed && (
                    <>
                      <HStack justify="center" w="full">
                        <Text
                          w="33%"
                          color="blue.600"
                          borderRadius={8}
                          fontWeight="bold"
                          fontSize="xs"
                          textAlign="center"
                        >
                          LEAF INDEX
                        </Text>
                        <Text
                          w="33%"
                          color="blue.600"
                          borderRadius={8}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          SENDER
                        </Text>
                        <Text
                          w="33%"
                          color="blue.600"
                          borderRadius={8}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          COMMITMENT
                        </Text>
                      </HStack>

                      { includedDeposits.length > 0 ?
                        <VStack
                          w="full"
                          minH="360px"
                          overflowY="auto"
                          bg="gray.50"
                          py={4}
                          gap={1}
                        >
                          { includedDeposits
                            .slice(
                              includedDeposits.length < 30
                                ? 0
                                : includedDeposits.length - 30
                            )
                            .map(({ commitment, sender, leafIndex }, index) => (
                              <HStack
                                key={`included-${leafIndex}`}
                                justify="center"
                                w="full"
                                borderTop={index ? 'solid 1px #BEE3F8' : 'none'}
                                pt={4}
                              >
                                <HStack w="33%" justify="center">
                                  <Text>{leafIndex.toString()}</Text>
                                </HStack>

                                <HStack w="33%" justify="flex-start">
                                  <Link
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
                                      wordBreak="break-all"
                                      {...growShrinkProps}
                                    >
                                      {pinchString(sender.toString(), 5)}{' '}
                                      <ExternalLinkIcon />
                                    </Text>
                                  </Link>
                                </HStack>

                                <HStack w="33%" justify="flex-start">
                                  <Text>{pinchString(commitment, 6)}</Text>
                                </HStack>
                              </HStack>
                            ))}
                        </VStack> : "" }
                    </>
                  )}

                  <HStack justify="space-between" align="center" pt={4}>
                    <HStack>
                      <Tooltip label="The withdrawal is cryptographically verified to NOT have originated from one of these deposits. These are the bad guys!">
                        <QuestionOutlineIcon />
                      </Tooltip>
                      <Heading color="blue.700" size="sm">
                        Excluded Deposits
                      </Heading>
                    </HStack>

                    <Text fontWeight="bold" color="blue.700" fontSize="sm">
                      Total: {excludedDeposits.length}
                    </Text>
                  </HStack>

                  <Stack align="center" p={4}>
                    <Button
                      w="full"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setIsExcludedDepositsCollapsed(
                          !isExcludedDepositsCollapsed
                        )
                      }
                    >
                      <Text fontWeight="normal" fontSize="xs">
                        {isExcludedDepositsCollapsed
                          ? 'Show Excluded Deposits'
                          : 'Hide Excluded Deposits'}
                      </Text>
                    </Button>
                  </Stack>

                  {!isExcludedDepositsCollapsed && (
                    <>
                      <HStack justify="center" w="full">
                        <Text
                          w="33%"
                          color="blue.600"
                          borderRadius={8}
                          fontWeight="bold"
                          fontSize="xs"
                          textAlign="center"
                        >
                          LEAF INDEX
                        </Text>
                        <Text
                          w="33%"
                          color="blue.600"
                          borderRadius={8}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          SENDER
                        </Text>
                        <Text
                          w="33%"
                          color="blue.600"
                          borderRadius={8}
                          fontWeight="bold"
                          fontSize="xs"
                        >
                          COMMITMENT
                        </Text>
                      </HStack>

                      <VStack
                        w="full"
                        maxH="360px"
                        overflowY="auto"
                        bg="gray.50"
                        py={4}
                        gap={1}
                      >
                        {excludedDeposits
                          .slice(
                            excludedDeposits.length < 30
                              ? 0
                              : excludedDeposits.length - 30
                          )
                          .map(({ commitment, sender, leafIndex }, index) => (
                            <HStack
                              key={`included-${leafIndex}`}
                              justify="center"
                              w="full"
                              borderTop={index ? 'solid 1px #BEE3F8' : 'none'}
                              pt={4}
                            >
                              <HStack w="33%" justify="center">
                                <Text>{leafIndex.toString()}</Text>
                              </HStack>

                              <HStack w="33%" justify="flex-start">
                                <Link
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
                                    wordBreak="break-all"
                                    {...growShrinkProps}
                                  >
                                    {pinchString(sender.toString(), 5)}{' '}
                                    <ExternalLinkIcon />
                                  </Text>
                                </Link>
                              </HStack>

                              <HStack w="33%" justify="flex-start">
                                <Text>{pinchString(commitment, 6)}</Text>
                              </HStack>
                            </HStack>
                          ))}
                      </VStack>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Container>
        )}
      </Box>
    </DappLayout>
  );
}

export default Page;
