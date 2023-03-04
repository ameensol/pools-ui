import React from 'react';
import {
  Box,
  Button,
  Container,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  FormControl,
  FormLabel,
  Flex
} from '@chakra-ui/react';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import { atom, useAtom } from 'jotai';
import { hexZeroPad } from 'ethers/lib/utils';
import { NoteWalletV2 } from 'privacy-pools';
import {
  activeIndexAtom,
  noteAtom,
  mnemonicAtom,
  DefaultNote,
  stageAtom
} from '../../state/atoms';

const isLoadingAtom = atom(false);

export default function Manage() {
  const [showData, setShowData] = React.useState(false);
  const [newIndex, setNewIndex] = React.useState<number>(NaN);
  const [_stage, setStage] = useAtom(stageAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [mnemonic, setMnemonic] = useAtom(mnemonicAtom);
  const [activeIndex, setActiveIndex] = useAtom(activeIndexAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  const calculateNextKeys = (newIndex: number) => {
    const _noteWallet = new NoteWalletV2(mnemonic, newIndex);
    const _nextKeys = _noteWallet.interiorKeys[newIndex];
    setNote({
      index: newIndex,
      commitment: _nextKeys.commitment,
      secret: _nextKeys.secret
    });
    setActiveIndex(newIndex);
    setTimeout(() => setIsLoading(false), 1);
  };

  const handleChange: React.Dispatch<React.SetStateAction<number>> = (
    newIndex
  ) => {
    if (isLoading) return;
    if (Number.isNaN(newIndex)) return;
    setIsLoading(true);
    setTimeout(() => calculateNextKeys(Number(newIndex)), 200);
  };

  const logoutWallet = () => {
    setMnemonic('');
    setNote(DefaultNote);
    setStage('Unlock');
  };

  return (
    <Container maxW="98vw" minW="216px">
      <Container>
        <Flex direction="column">
          <FormControl>
            <FormLabel>
              <Text fontWeight="bold">COMMITMENT</Text>
            </FormLabel>
            <Flex justifyContent="left" fontSize="sm" my={1}>
              <Text color="gray.600">
                The public commitment to be used in private proof of membership.
              </Text>
            </Flex>
            <Text
              size="lg"
              py={4}
              px={2}
              borderRadius="10px"
              bg="gray.100"
              fontSize="sm"
              fontWeight="bold"
              fontFamily="monospace"
              cursor="select"
              sx={{ wordBreak: 'break-word' }}
            >
              {hexZeroPad(
                '0x' + (note.commitment as any as BigInt).toString(16),
                32
              )}
            </Text>
          </FormControl>

          <Box my={6}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChange(newIndex);
              }}
            >
              <FormLabel>
                <Text fontWeight="bold">INDEX</Text>
              </FormLabel>
              <Flex justifyContent="center" fontSize="sm" my={1}>
                <Text color="gray.600">
                  Part of the HD derivation path. Change this to use a different
                  commitment.
                </Text>
              </Flex>
              <Flex w="full">
                <NumberInput
                  w="20%"
                  size="sm"
                  defaultValue={activeIndex}
                  min={0}
                  max={1000}
                  onChange={(valueAsString, valueAsNumber) =>
                    setNewIndex(valueAsNumber)
                  }
                  allowMouseWheel
                >
                  <Box bg="gray.50" borderRadius={8}>
                    <NumberInputField
                      color="gray.700"
                      bg="transparent"
                      border="none"
                      _active={{ border: 'none' }}
                      _focus={{ border: 'none' }}
                      _hover={{ border: 'none' }}
                    />
                  </Box>
                  <NumberInputStepper>
                    <NumberIncrementStepper _hover={{ bg: 'gray.200' }} />
                    <NumberDecrementStepper _hover={{ bg: 'gray.200' }} />
                  </NumberInputStepper>
                </NumberInput>
                <Button
                  ml={10}
                  bg="black"
                  color="white"
                  border="none"
                  boxShadow="2xl"
                  _hover={{
                    bg: 'black',
                    color: 'white',
                    borderColor: 'black',
                    transform: 'scaleX(1.02)'
                  }}
                  w="80%"
                  size="sm"
                  type="submit"
                  disabled={
                    Number.isNaN(newIndex) || activeIndex === Number(newIndex)
                  }
                >
                  Select
                </Button>
              </Flex>
            </form>
          </Box>

          <Flex
            w="full"
            justifyContent="center"
            direction="column"
            alignItems="center"
            mt={5}
          >
            {showData ? (
              <Box bg="gray.50" w="full" borderRadius="20px" p={2}>
                <FormControl>
                  <FormLabel>
                    <Text fontWeight="bold">SECRET</Text>
                  </FormLabel>
                  <Flex justifyContent="left" fontSize="sm" my={0}>
                    <Text color="gray.600">
                      Secret is the wallet&apos;s private key mod q.
                    </Text>
                  </Flex>
                  <Text
                    size="lg"
                    py={4}
                    px={2}
                    borderRadius="10px"
                    bg="gray.100"
                    fontSize="sm"
                    fontWeight="bold"
                    fontFamily="monospace"
                    cursor="select"
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {`0x${(note.secret as any as BigInt).toString(16)}`}
                  </Text>
                </FormControl>

                <FormControl my={4}>
                  <FormLabel>
                    <Text fontWeight="bold">MNEMONIC</Text>
                  </FormLabel>
                  <Flex justifyContent="left" fontSize="sm" mt={0} mb={1}>
                    <Text color="gray.600">
                      {' '}
                      Only use a mnemonic generated by this page.
                    </Text>
                  </Flex>
                  <Text
                    size="lg"
                    py={4}
                    px={2}
                    borderRadius="10px"
                    bg="gray.100"
                    fontSize="sm"
                    fontWeight="bold"
                    fontFamily="monospace"
                    cursor="select"
                    sx={{ wordBreak: 'break-word' }}
                  >
                    {mnemonic.toString()}
                  </Text>
                </FormControl>
              </Box>
            ) : null}

            <Button
              onClick={() => setShowData(!showData)}
              size="md"
              w="full"
              mt={5}
              type="submit"
              bg="gray.100"
              color="black"
              borderRadius={8}
              boxShadow="2xl"
              borderColor="red"
              border="3px solid black"
              _hover={{
                bg: 'gray.700',
                color: 'white',
                borderColor: 'gray.600',
                transform: 'scaleX(1.01)'
              }}
            >
              {showData ? (
                <Flex alignItems="center">
                  <AiFillEyeInvisible size={20} />
                  <Text ml={1} textDecoration="none">
                    Hide Secrets
                  </Text>
                </Flex>
              ) : (
                <Flex alignItems="center">
                  <AiFillEye size={20} />
                  <Text ml={1} textDecoration="none">
                    Show Secrets
                  </Text>
                </Flex>
              )}
            </Button>
            <Button
              onClick={logoutWallet}
              size="lg"
              mt={5}
              mb={5}
              w="full"
              type="submit"
              bg="black"
              color="white"
              boxShadow="2xl"
              _hover={{
                bg: 'black',
                color: 'white',
                borderColor: 'black',
                transform: 'scaleX(1.02)'
              }}
            >
              LOGOUT
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
}
