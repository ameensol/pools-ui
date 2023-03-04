import React from 'react';
import {
  Center,
  Button,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Flex
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';

import { useAtom } from 'jotai';
import { hexZeroPad } from 'ethers/lib/utils';
import { stageAtom, activeIndexAtom } from '../../state';

import NoteWallet from './NoteWallet';
import { useNote } from '../../hooks';
import { growShrinkProps, pinchString } from '../../utils';

const DropdownIcon = () => (
  <svg fill="none" height="7" width="14" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.75 1.54001L8.51647 5.0038C7.77974 5.60658 6.72026 5.60658 5.98352 5.0038L1.75 1.54001"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      xmlns="http://www.w3.org/2000/svg"
    />
  </svg>
);

export function NoteWalletConnectButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { commitment } = useNote();
  const [stage] = useAtom(stageAtom);
  const [activeIndex] = useAtom(activeIndexAtom);
  const [_stage, setStage] = useAtom(stageAtom);

  return (
    <>
      <Center>
        <Button
          boxShadow="xl"
          bg="black"
          color="white"
          ref={btnRef as unknown as React.LegacyRef<HTMLButtonElement>}
          variant="outline"
          onClick={onOpen}
          borderRadius={15}
          border="none"
          w="full"
          height="40px"
          px={commitment ? 0.5 : 1.5}
          {...growShrinkProps}
        >
          <HStack w="full">
            {!commitment.eq(0) ? (
              <Flex
                height={{ base: '35px', md: '36px' }}
                justifyContent="space-between"
                w="full"
                align="center"
              >
                <Text px={{ base: 1, md: 2 }}>Note {activeIndex}</Text>
                <HStack
                  w="full"
                  px={2}
                  bg="gray.600"
                  color="white"
                  justifyContent="space-evenly"
                  h="full"
                  borderRadius={8}
                >
                  <Text>
                    {pinchString(
                      hexZeroPad(commitment.toHexString(), 32),
                      [4, 6]
                    )}
                  </Text>
                  <DropdownIcon />
                </HStack>
              </Flex>
            ) : (
              <>
                <Text px={4} textAlign="center" w="full">
                  Connect Note Wallet
                </Text>
              </>
            )}
          </HStack>
        </Button>
      </Center>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl" bg="white">
          <ModalHeader textAlign="center">
            <Flex alignItems="center">
              {_stage !== 'Connect' && _stage !== 'Manage' && (
                <IconButton
                  aria-label="Go back"
                  icon={<FaArrowLeft />}
                  onClick={() => setStage('Connect')}
                  bg="white"
                  mt={-2}
                  ml={-4}
                />
              )}
              <Center flex="1">{stage} your Note Wallet</Center>
            </Flex>
          </ModalHeader>
          <ModalCloseButton
            size="md"
            mt={1}
            borderRadius="50%"
            {...growShrinkProps}
          />
          <ModalBody px={{ base: 0, md: 5 }}>
            <NoteWallet />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
