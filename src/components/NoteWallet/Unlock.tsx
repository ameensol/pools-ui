import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  Input,
  Link,
  InputGroup,
  Progress,
  Text,
  Flex
} from '@chakra-ui/react';
import { AiOutlineFileText } from 'react-icons/ai';

import PasswordInput from './PasswordInput';

import { useAtom } from 'jotai';
import {
  noteAtom,
  mnemonicAtom,
  stageAtom,
  activeIndexAtom,
  encryptedJsonAtom,
  EncryptedJson
} from '../../state/atoms';

import * as ethers from 'ethers';
import { NoteWalletV2 } from 'privacy-pools';

const validateEncryptedMnemonic = (_encryptedMnemonic: EncryptedJson) => {
  if (typeof _encryptedMnemonic !== 'object') {
    return false;
  }

  ['address', 'crypto', 'x-ethers'].map((expectedKey) => {
    if (!Object.keys(_encryptedMnemonic).includes(expectedKey)) return false;
  });

  return true;
};

export default function Unlock() {
  const [decryptProgress, setDecryptProgress] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptFailed, setDecryptFailed] = useState(false);

  const [_note, setNote] = useAtom(noteAtom);
  const [_mnemonic, setMnemonic] = useAtom(mnemonicAtom);
  const [activeIndex] = useAtom(activeIndexAtom);
  const [encryptedJson, setEncryptedJson] = useAtom(encryptedJsonAtom);

  const [_, setStage] = useAtom(stageAtom);

  const handleFileChange = (e: any) => {
    console.log('here1');
    e.preventDefault();
    const file = e.target.files[0];
    if (typeof file === 'undefined') {
      setEncryptedJson({});
      console.log('here2');
      return;
    }
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        console.log('here3');
        let _encryptedMnemonic = JSON.parse(fileReader.result as string);
        if (typeof _encryptedMnemonic === 'string') {
          _encryptedMnemonic = JSON.parse(_encryptedMnemonic);
        }
        if (validateEncryptedMnemonic(_encryptedMnemonic)) {
          setEncryptedJson(_encryptedMnemonic);
        } else {
          setEncryptedJson({});
          throw new Error('Invalid mnemonic file!');
        }
        console.log('here4');
      } catch (e) {
        console.log(e);
        alert('Failed to parse the JSON file.');
        console.log('here4');
        setEncryptedJson({});
      }
    };
    fileReader.readAsText(file);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (Object.keys(encryptedJson).length === 0) {
      return;
    }
    const formData = new FormData(e.target);
    const [_password] = [...formData.values()];
    if (_password) {
      setDecryptFailed(false);
      setIsDecrypting(true);
      ethers.Wallet.fromEncryptedJson(
        JSON.stringify(encryptedJson),
        _password.toString(),
        setDecryptProgress
      )
        .then((_wallet) => {
          const _noteWallet = new NoteWalletV2(
            _wallet.mnemonic.phrase,
            activeIndex
          );
          const _nextKeys = _noteWallet.interiorKeys[activeIndex];
          setMnemonic(_wallet.mnemonic.phrase);
          setNote({
            index: activeIndex,
            commitment: _nextKeys.commitment,
            secret: _nextKeys.secret
          });
        })
        .then(() => setTimeout(() => setIsDecrypting(false), 1))
        .then(() => setTimeout(() => setStage('Manage'), 1))
        .catch((err) => {
          console.log('here4');
          setDecryptFailed(true);
          setIsDecrypting(false);
          alert('Failed to decrypt the mnemonic.');
        });
    }
  };

  return (
    <Container>
      <Center h="100%">
        <Container pb={4} borderRadius={8} fontWeight="bold">
          <form onSubmit={handleSubmit}>
            <Box>
              <Box>
                <Input
                  id={'fileElementId'}
                  type="file"
                  accept="json"
                  onChange={handleFileChange}
                  sx={{ display: 'none' }}
                />
                <Flex h="100%" pt={4} alignItems="center">
                  {typeof encryptedJson?.address === 'undefined' ? (
                    <Button
                      w="100%"
                      onClick={() =>
                        document.getElementById('fileElementId')?.click()
                      }
                      size={{ base: 'md', md: 'lg' }}
                    >
                      Select Encrypted File
                    </Button>
                  ) : (
                    <Box w="full" my={2}>
                      <Text color="black" my={2} fontSize="md">
                        Select Your Encrypted Json File
                      </Text>
                      <Flex align="center">
                        <InputGroup size="lg" w="75%">
                          <Input
                            readOnly
                            size="md"
                            bg="gray.50"
                            type="text"
                            fontSize="sm"
                            value={encryptedJson.address}
                            focusBorderColor="gray.400"
                          />
                        </InputGroup>
                        <Button
                          onClick={() =>
                            document.getElementById('fileElementId')?.click()
                          }
                          disabled={isDecrypting}
                          size="md"
                          bg="black"
                          color="white"
                          w="25%"
                          mx={2}
                          _hover={{
                            bg: 'black',
                            color: 'white',
                            borderColor: 'black',
                            transform: 'scaleX(1.01)'
                          }}
                        >
                          <Flex alignItems="center" justifyContent="center">
                            <Text
                              fontSize={{
                                base: 'xs',
                                md: 'md'
                              }}
                            >
                              Choose File
                            </Text>
                            {/* <AiOutlineFileText/> */}
                          </Flex>
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Box>

              <Box my={2}>
                <Flex h="100%" alignItems="center">
                  <Box w="full">
                    <Text color="black" my={2} fontSize="md">
                      Password
                    </Text>
                    <FormControl>
                      <PasswordInput
                        name="decryptPassword"
                        placeholder="Enter password"
                        isInvalid={decryptFailed}
                        isDisabled={isDecrypting}
                      />
                    </FormControl>
                  </Box>
                </Flex>
              </Box>

              <Box mt={10}>
                <Flex alignItems="center" justifyContent="center" py={2}>
                  {decryptFailed && (
                    <Text fontSize="xs" fontWeight="600" color="red.500" mt={1}>
                      FAILED TO DECRYPT: Invalid Json File or password value
                      provided.
                    </Text>
                  )}
                </Flex>
                <Flex h="100%" alignItems="center">
                  <Button
                    disabled={isDecrypting}
                    size="lg"
                    w="full"
                    type="submit"
                    bg="black"
                    color="white"
                    boxShadow="2xl"
                    _hover={{
                      bg: 'black',
                      color: 'white',
                      borderColor: 'black',
                      transform: 'scaleX(1.05)'
                    }}
                    isDisabled={isDecrypting}
                  >
                    UNLOCK
                  </Button>
                </Flex>
              </Box>

              {isDecrypting && (
                <Box mt={2}>
                  <Progress value={decryptProgress * 100} size="md" mt={4} />
                  <Container centerContent px={0} pt={2} textAlign="center">
                    <Text fontSize="xs" color="gray.600">
                      Attempting to decrypt wallet.If the password is wrong,
                      this operation will fail
                    </Text>
                  </Container>
                </Box>
              )}
            </Box>
          </form>
          <Flex justifyContent="center" fontSize="sm" mt={5}>
            <Text color="gray.600">Don&apos;t Have A Note Wallet? </Text>
            <Link color="blue.500" onClick={() => setStage('Create')} ml={1}>
              Create One
            </Link>
          </Flex>
        </Container>
      </Center>
    </Container>
  );
}
