import { useState } from 'react';
import {
  Button,
  Container,
  Heading,
  Stack,
  HStack,
  Text,
  Table,
  TableContainer,
  Thead,
  Td,
  Tr,
  Tbody,
  TableCaption,
  Th,
  Tfoot,
  Link
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useNetwork } from 'wagmi';
import { hexZeroPad } from 'ethers/lib/utils';
import { DappLayout, PoolExplorer } from '../components';
import { useCommitments, useSubsetRoots, useContractAddress } from '../hooks';
import { growShrinkProps, pinchString } from '../utils';

function Page() {
  const [isDepositsCollapsed, setIsDepositsCollapsed] = useState<boolean>(true);
  const [isWithdrawalsCollapsed, setIsWithdrawalsCollapsed] =
    useState<boolean>(true);
  const { chain } = useNetwork();
  const { contractAddress } = useContractAddress();
  const { commitments } = useCommitments();
  const { subsetRoots } = useSubsetRoots();

  return (
    <DappLayout title="Stats | Privacy 2.0">
      <PoolExplorer />

      {Array.isArray(commitments) && commitments.length > 0 && (
        <Container centerContent minW="216px" maxW="960px">
          <Stack
            w="full"
            direction="row"
            justify="space-between"
            align="center"
            position="sticky"
            zIndex="2"
            top={0}
            bg="gray.300"
            mt={4}
            p={4}
            border="solid 1px #BEE3F8"
            borderBottom="none"
            borderRadius="8px 8px 0 0"
          >
            <Heading color="black" size="sm">
              Deposits
            </Heading>

            <Text fontWeight="bold" color="black" fontSize="sm">
              Total: {commitments?.length}
            </Text>
          </Stack>

          <Stack
            w="full"
            bg="gray.50"
            border="solid 1px #BEE3F8"
            borderTop="none"
            borderRadius="0 0 8px 8px"
          >
            <Stack align="center" py={2} px={2}>
              <Button
                w="full"
                size="sm"
                variant="outline"
                onClick={() => setIsDepositsCollapsed(!isDepositsCollapsed)}
              >
                Show Deposits
              </Button>
            </Stack>

            {!isDepositsCollapsed && (
              <TableContainer
                whiteSpace="unset"
                maxH="42vh"
                overflowY="auto"
                p={2}
                w="full"
              >
                <Table variant="simple" size="md" colorScheme="blue">
                  <TableCaption>
                    Deposits list for {contractAddress}
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th>
                        <Text color="blue.600">#</Text>
                      </Th>
                      <Th>
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
                      <Th>
                        <HStack>
                          <Text color="blue.600">Commitment</Text>
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
                    {commitments
                      .slice(
                        commitments.length < 30 ? 0 : commitments.length - 30
                      )
                      .map(({ commitment, leafIndex, sender }) => (
                        <Tr key={`commitments-row-${leafIndex}`}>
                          <Td>{leafIndex}</Td>
                          <Td>
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
                                wordBreak="break-all"
                                {...growShrinkProps}
                              >
                                {pinchString(sender.toString(), 12)}{' '}
                                <ExternalLinkIcon />
                              </Text>
                            </Link>
                          </Td>
                          <Td>
                            <Text wordBreak="break-all">
                              {pinchString(hexZeroPad(commitment, 32), 16)}
                            </Text>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>

                  <Tfoot>
                    <Tr>
                      <Th>
                        <Text color="blue.600">#</Text>
                      </Th>
                      <Th>
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
                      <Th>
                        <HStack>
                          <Text color="blue.600">Commitment</Text>
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
            )}
          </Stack>
        </Container>
      )}

      {Array.isArray(subsetRoots) && subsetRoots.length > 0 && (
        <Container centerContent minW="216px" maxW="960px" mb={40}>
          <Stack w="full">
            <Stack
              w="full"
              direction="row"
              justify="space-between"
              align="center"
              position="sticky"
              zIndex="2"
              top={0}
              bg="gray.200"
              mt={4}
              p={4}
              border="solid 1px #BEE3F8"
              borderBottom="none"
              borderRadius="8px 8px 0 0"
            >
              <Heading color="black" size="sm">
                Withdrawals
              </Heading>

              <Text fontWeight="bold" color="black" fontSize="sm">
                Total: {subsetRoots?.length}
              </Text>
            </Stack>
          </Stack>

          <Stack
            w="full"
            bg="gray.50"
            border="solid 1px #BEE3F8"
            borderTop="none"
            borderRadius="0 0 8px 8px"
          >
            <Stack align="center" p={2}>
              <Button
                w="full"
                size="sm"
                variant="outline"
                onClick={() =>
                  setIsWithdrawalsCollapsed(!isWithdrawalsCollapsed)
                }
              >
                {isWithdrawalsCollapsed
                  ? 'Show Withdrawals'
                  : 'Hide Withdrawls'}
              </Button>
            </Stack>

            {!isWithdrawalsCollapsed && (
              <TableContainer
                whiteSpace="unset"
                maxH="42vh"
                overflowY="auto"
                p={2}
              >
                <Table variant="simple" size="md" colorScheme="blue">
                  <TableCaption>
                    Withdrawals list for {contractAddress}
                  </TableCaption>

                  <Thead>
                    <Tr>
                      <Th>
                        <HStack>
                          <Text color="blue.600">Recipient</Text>
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

                      <Th>
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

                      <Th>
                        <HStack>
                          <Text color="blue.600">Relayer</Text>
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

                      <Th>
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

                      <Th>
                        <HStack>
                          <Text color="blue.600">Subset Root</Text>
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
                    {subsetRoots
                      .slice(
                        subsetRoots.length < 30 ? 0 : subsetRoots.length - 30
                      )
                      .map(
                        ({
                          recipient,
                          relayer,
                          sender,
                          subsetRoot,
                          nullifier
                        }) => (
                          <Tr key={`row-${nullifier}`}>
                            <Td w="20%" wordBreak="break-word">
                              <Link
                                w="full"
                                as={NextLink}
                                {...growShrinkProps}
                                href={`${chain?.blockExplorers?.default.url}/address/${recipient}`}
                                isExternal
                              >
                                <Text
                                  key={`${nullifier}-${recipient}`}
                                  color="blue.700"
                                  fontSize="sm"
                                  textAlign="left"
                                  {...growShrinkProps}
                                >
                                  {pinchString(recipient, 6)}{' '}
                                  <ExternalLinkIcon />
                                </Text>
                              </Link>
                            </Td>

                            <Td w="20%" wordBreak="break-word">
                              {pinchString(nullifier, 10)}
                            </Td>

                            <Td w="20%" wordBreak="break-word">
                              <Link
                                w="full"
                                as={NextLink}
                                {...growShrinkProps}
                                href={`${chain?.blockExplorers?.default.url}/address/${relayer}`}
                                isExternal
                              >
                                <Text
                                  key={`${nullifier}-${relayer}`}
                                  color="blue.700"
                                  fontSize="sm"
                                  textAlign="left"
                                  {...growShrinkProps}
                                >
                                  {pinchString(relayer, 6)} <ExternalLinkIcon />
                                </Text>
                              </Link>
                            </Td>

                            <Td w="20%" wordBreak="break-word">
                              <Link
                                w="full"
                                as={NextLink}
                                {...growShrinkProps}
                                href={`${chain?.blockExplorers?.default.url}/address/${sender}`}
                                isExternal
                              >
                                <Text
                                  key={`${nullifier}-${sender}`}
                                  color="blue.700"
                                  fontSize="sm"
                                  textAlign="left"
                                  {...growShrinkProps}
                                >
                                  {pinchString(sender, 6)} <ExternalLinkIcon />
                                </Text>
                              </Link>
                            </Td>

                            <Td w="20%" wordBreak="break-word">
                              {pinchString(subsetRoot, 10)}
                            </Td>
                          </Tr>
                        )
                      )}
                  </Tbody>

                  <Tfoot>
                    <Tr>
                      <Th>
                        <HStack>
                          <Text color="blue.600">Recipient</Text>
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

                      <Th>
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

                      <Th>
                        <HStack>
                          <Text color="blue.600">Relayer</Text>
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

                      <Th>
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

                      <Th>
                        <HStack>
                          <Text color="blue.600">Subset Root</Text>
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
            )}
          </Stack>
        </Container>
      )}
    </DappLayout>
  );
}

export default Page;
