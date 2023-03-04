import { Flex, Box, Link, IconButton, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaSwimmingPool } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top={0}
      zIndex={10}
      py={5}
      backdropFilter="auto"
      backdropBlur="8px"
      filter="auto"
    >
      <Link as={NextLink} href="/" _hover={{ textDecoration: 'none' }}>
        <Flex align="center">
          <Box as={FaSwimmingPool} boxSize={8} mr={4} />
          <Box as="h1" fontSize="2xl" fontWeight="bold" flex="1">
            PRIVACY POOLS
          </Box>
        </Flex>
      </Link>
      <Box display={{ base: 'none', md: 'block' }}>
        <Link
          fontWeight="bold"
          mr={4}
          target="_blank"
          href="https://github.com/privacy-pools/the-lounge"
        >
          docs
        </Link>
        {!scrolled && (
          <Link
            fontWeight="bold"
            mr={4}
            target="_blank"
            href="https://github.com/privacy-pools"
          >
            github
          </Link>
        )}
        <Link fontWeight="bold" mr={4} target="_blank" href="/explorer">
          explorer
        </Link>
        <Link fontWeight="bold" mr={4} target="_blank" href="/stats">
          dapp
        </Link>
      </Box>
      <IconButton
        aria-label="Navigation menu"
        icon={<HamburgerIcon />}
        size="xl"
        fontWeight="bold"
        variant="ghost"
        p={3}
        borderRadius="full"
        display={{ base: 'block', md: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      />
      {isOpen && (
        <Box
          bg="white"
          position="absolute"
          top="60px"
          right="0"
          py={2}
          px={4}
          display={{ base: 'block', md: 'none' }}
        >
          <Link
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
            target="_blank"
            href="https://github.com/privacy-pools/the-lounge"
          >
            docs
          </Link>
          <Link
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
            target="_blank"
            href="https://github.com/privacy-pools"
          >
            github
          </Link>
          <Link
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
            target="_blank"
            href="/explorer"
          >
            explorer
          </Link>
          <Link
            mr={4}
            display="block"
            mb={2}
            fontWeight="bold"
            target="_blank"
            href="/stats"
          >
            dapp
          </Link>
        </Box>
      )}
    </Flex>
  );
};

export default NavBar;
