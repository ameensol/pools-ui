import React from 'react';
import {
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

import SubsetMaker from './SubsetMaker';

export function SubsetMakerButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        bg="gray.200"
        color="black"
        mx={2}
        fontSize="lg"
        fontWeight="bold"
        _hover={{
          bg: 'white',
          color: 'black',
          borderColor: 'gray.600',
          transform: 'scaleX(1.05)'
        }}
        w={['75%', '50%']}
      >
        Subset Maker
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Subset Maker Demo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="center" justify="center">
              <SubsetMaker key="subset-maker" />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default SubsetMakerButton;
