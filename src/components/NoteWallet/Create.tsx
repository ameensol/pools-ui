import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Link,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Textarea,
  Spinner,
  Icon
} from '@chakra-ui/react';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos
} from 'react-icons/md';
import { FiExternalLink } from 'react-icons/fi';
import { FiDownload } from 'react-icons/fi';

import PasswordInput from './PasswordInput';

import { useAtom } from 'jotai';
import {
  stageAtom,
  EncryptedJson,
  encryptedJsonAtom,
  downloadUrlAtom
} from '../../state';

import * as zxcvbn from 'zxcvbn';
import * as ethers from 'ethers';
import { NoteWalletV2 } from 'privacy-pools';

const MIN_PW_LENGTH = 8;
const MIN_PW_STRENGTH = 3;

export default function Create() {
  const [mnemonic, setMnemonic] = useState('');
  const [mnemonicError, setMnemonicError] = useState('');

  const [tempWallet, setTempWallet] = useState<ethers.Wallet>();
  const [tempEncryptedMnemonic, setTempEncryptedMnemonic] =
    useState<EncryptedJson>();
  const [isErrored, setIsErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptProgress, setEncryptProgress] = useState(0);

  const [_stage, setStage] = useAtom(stageAtom);
  const [_encryptedJson, setEncryptedJson] = useAtom(encryptedJsonAtom);
  const [downloadUrl, setDownloadUrl] = useAtom(downloadUrlAtom);

  useEffect(() => {
    if (tempWallet?.mnemonic?.phrase) {
      setMnemonic(tempWallet.mnemonic.phrase);
    }
  }, [tempWallet]);

  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (index: number) => {
    setCurrentTab(index);
  };
  const [tabIndex, setTabIndex] = useState(0);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTabIndex(parseInt(event.target.value, 10));
  };

  const download = () => {
    console.log('inside download');

    if (typeof tempEncryptedMnemonic === 'undefined') return;
    const blob = new Blob([JSON.stringify(tempEncryptedMnemonic, null, 2)], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('target', '_blank');
    element.setAttribute(
      'download',
      `privacy-pools-encrypted-json-0x${tempEncryptedMnemonic?.address}.json`
    );
    element.click();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (typeof tempWallet === 'undefined') return;

    const formData = new FormData(event.target as HTMLFormElement);
    const [_password, _confirm] = [...formData.values()];
    if (_password !== _confirm) {
      setIsErrored(true);
      setErrorMessage('Passwords do not match');
      return;
    } else if (_password.toString().length < MIN_PW_LENGTH) {
      setIsErrored(true);
      setErrorMessage(
        `Password must be at least ${MIN_PW_LENGTH} characters long`
      );
      return;
    } else {
      setIsErrored(false);
      setErrorMessage('');
    }

    try {
      const result = zxcvbn(_password);
      const { score, feedback } = result;
      if (score < MIN_PW_STRENGTH) {
        setIsErrored(true);
        if (feedback.warning) {
          setErrorMessage(feedback.warning);
        } else {
          setErrorMessage(`Password is too weak.`);
        }
        return;
      } else {
        const _noteWallet = new NoteWalletV2(tempWallet.mnemonic.phrase, 0);
        setIsEncrypting(true);
        setEncryptProgress;
        _noteWallet
          .encryptToJson(_password)
          .then((encryptedJson: string) => {
            const parsedJson = JSON.parse(encryptedJson);
            const blob = new Blob([JSON.stringify(parsedJson, null, 2)]);
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setTempEncryptedMnemonic(parsedJson);
            setIsEncrypting(false);
          })
          .then(() => setTimeout(() => setIsEncrypting(false), 1))
          .then(() => setCurrentTab(2));
      }
    } catch (err) {
      console.error(err);
      setIsErrored(true);
      setIsEncrypting(false);
    }
  };

  return (
    <Container width="100%">
      <Flex width="100%" justifyContent="center">
        <Tabs
          index={currentTab}
          onChange={handleTabChange}
          variant="enclosed"
          width="100%"
          isFitted
        >
          <TabList mb="1em" height="50px">
            <Tab _selected={{ color: 'white', bg: 'gray.900' }}>
              <Text fontSize="sm">1 Create Mnemonic</Text>
            </Tab>
            {tempWallet ? (
              <Tab _selected={{ color: 'white', bg: 'gray.900' }}>
                <Text fontSize="sm">2 Create Password</Text>
              </Tab>
            ) : (
              <Tab _selected={{ color: 'white', bg: 'gray.900' }} isDisabled>
                <Text fontSize="sm">2 Create Password</Text>
              </Tab>
            )}

            {tempEncryptedMnemonic ? (
              <Tab _selected={{ color: 'white', bg: 'gray.900' }}>
                <Text fontSize="sm">3 Download Secrets</Text>
              </Tab>
            ) : (
              <Tab _selected={{ color: 'white', bg: 'gray.900' }} isDisabled>
                <Text fontSize="sm">3 Download Secrets</Text>
              </Tab>
            )}
          </TabList>
          <TabPanels>
            <TabPanel minHeight="400px">
              <Box>
                <form>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!mnemonicError}>
                      <FormLabel fontSize="md">
                        Create Your 12 Words Mnemonic
                      </FormLabel>
                      <Textarea
                        value={mnemonic || ''}
                        onChange={(e) => setMnemonic(e.target.value)}
                        placeholder="Enter your random Mnemonic"
                        focusBorderColor="gray.400"
                        bg="gray.50"
                        size={{ base: 'xs', md: 'md' }}
                        fontFamily="monospace"
                        fontWeight="normal"
                      />
                      <FormErrorMessage>{mnemonicError}</FormErrorMessage>
                    </FormControl>
                    <Flex
                      justifyContent="center"
                      fontSize={{ base: 'xs', md: 'xs' }}
                      direction={{
                        base: 'column',
                        md: 'row'
                      }}
                      alignItems="center"
                    >
                      <Text color="gray.700">
                        Mnemonic Codes can be safely generated using many
                      </Text>
                      <Link
                        color="blue.500"
                        target="_blank"
                        href="https://iancoleman.io/bip39/"
                        ml={1}
                      >
                        Open source tools
                        <Icon as={FiExternalLink} boxSize={3} ml={1} />
                      </Link>
                    </Flex>
                    <Flex alignItems="center" justifyContent="center">
                      <Text fontWeight="bold">OR</Text>
                    </Flex>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setTempWallet(
                          ethers.Wallet.createRandom({
                            path: `m/44'/9777'/0'/0/0`
                          })
                        );
                      }}
                      size="md"
                      w="full"
                      type="submit"
                      bg="gray.200"
                      color="black"
                      boxShadow="2xl"
                      borderColor="red"
                      _hover={{
                        bg: 'gray.700',
                        color: 'white',
                        borderColor: 'gray.600',
                        transform: 'scaleX(1.01)'
                      }}
                    >
                      Generate A Random Mnemonic
                    </Button>

                    <Button
                      size="lg"
                      bg="black"
                      color="white"
                      w="100%"
                      mx={2}
                      my={8}
                      _hover={{
                        bg: 'black',
                        color: 'white',
                        borderColor: 'black',
                        transform: 'scaleX(1.01)'
                      }}
                      onClick={() => {
                        if (mnemonic.trim().split(' ').length !== 12) {
                          setMnemonicError(
                            'Mnemonic should be exactly 12 words separated by space'
                          );
                        } else {
                          setMnemonicError('');
                          setCurrentTab(1);
                        }
                      }}
                    >
                      <Flex alignItems="center">
                        <Text mr={2}>GO TO NEXT STEP</Text>
                        <MdOutlineArrowForwardIos size={15} />
                      </Flex>
                    </Button>
                    <Flex justifyContent="center" fontSize="sm" mt={8}>
                      <Link
                        color="blue.500"
                        onClick={() => setStage('Connect')}
                        ml={1}
                      >
                        <Flex alignItems="center">
                          <MdOutlineArrowBackIos size={15} />
                          <Text ml={1}>Go Back</Text>
                        </Flex>
                      </Link>
                    </Flex>
                  </VStack>
                </form>
              </Box>
            </TabPanel>

            <TabPanel minHeight="400px">
              <Box>
                <form onSubmit={handleSubmit}>
                  <Box w="full">
                    <FormControl>
                      <FormLabel>Wallet Identifier</FormLabel>
                      <Input
                        readOnly
                        size="lg"
                        bg="gray.50"
                        focusBorderColor="gray.400"
                        type="email"
                        fontSize="sm"
                        fontFamily="monospace"
                        cursor="not-allowed"
                        value={tempWallet?.address.slice(2)}
                        isDisabled={isEncrypting}
                      />
                    </FormControl>
                    <FormLabel fontSize="md" mt={5}>
                      Create A Strong Password
                    </FormLabel>
                    <FormControl isInvalid={isErrored}>
                      <PasswordInput
                        placeholder="Enter password"
                        name="password"
                        isInvalid={isErrored}
                        isDisabled={isEncrypting}
                      />

                      <PasswordInput
                        placeholder="Confirm password"
                        name="confirm"
                        isInvalid={isErrored}
                        isDisabled={isEncrypting}
                      />
                      <FormErrorMessage>{errorMessage}</FormErrorMessage>
                    </FormControl>

                    <Button
                      size="lg"
                      mt={8}
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
                      isLoading={isEncrypting}
                      loadingText="Preparing Your Note Wallet..."
                    >
                      {isEncrypting ? <Spinner size="sm" mr={2} /> : null}
                      {isEncrypting ? 'Loading' : 'Submit'}
                    </Button>
                    <Flex justifyContent="center" fontSize="sm" mt={5}>
                      <Link
                        color="blue.500"
                        onClick={() => setCurrentTab(0)}
                        ml={1}
                      >
                        <Flex alignItems="center">
                          <MdOutlineArrowBackIos size={15} />
                          <Text ml={1}>Go Back</Text>
                        </Flex>
                      </Link>
                    </Flex>
                  </Box>
                </form>
              </Box>
            </TabPanel>
            <TabPanel minHeight="400px">
              <Flex direction="column" justify="space-between">
                <Flex
                  width="full"
                  height="80%"
                  alignItems="center"
                  alignContent="center"
                  mb="160px"
                >
                  <Button
                    as={Link}
                    onClick={() => download()}
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    mt="20%"
                    bg="black"
                    color="white"
                    boxShadow="2xl"
                    border="4px solid black"
                    _hover={{
                      bg: 'white',
                      color: 'black',
                      borderColor: 'black',
                      transform: 'scaleX(1.01)',
                      textDecoration: 'none'
                    }}
                  >
                    <Flex alignItems="center">
                      <FiDownload size={20} />
                      <Text ml={2} textDecoration="none">
                        Download
                      </Text>
                    </Flex>
                  </Button>
                </Flex>
                <Flex height="10%" justifyContent="center" fontSize="xs">
                  <Link
                    color="gray.500"
                    onClick={() => setStage('Connect')}
                    ml={1}
                  >
                    <Text ml={1}>
                      Close this box after downloading & unlock your Note Wallet
                      with this secret.
                    </Text>
                  </Link>
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Container>
  );
}
