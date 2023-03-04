import {
  Box,
  BoxProps,
  Center,
  Container,
  Flex,
  Link,
  Stack
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Heading } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import React from 'react';
import { FaSwimmingPool } from 'react-icons/fa';

import { NoteWalletConnectButton } from './NoteWallet';

const growShrinkProps = {
  _hover: {
    transform: 'scale(1.025)'
  },
  _active: {
    transform: 'scale(0.95)'
  },
  transition: '0.125s ease'
};

interface HeaderNavbarProps extends BoxProps {
  title?: string;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({ title }) => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState(router.pathname);
  const isActiveLink = (href: string) => {
    return router.pathname === href;
  };

  const handleLinkClick = (path: string) => {
    router.push(path);
    setActiveLink(path);
  };

  const linkStyle = (link: string) => ({
    padding: isActiveLink(link) ? '17px 30px' : '',
    borderRadius: '18px',
    background: isActiveLink(link) ? 'white' : 'none',
    color: isActiveLink(link) ? 'black' : 'inherit'
    // border:  isActiveLink(link) ?"4px solid black":"",
  });

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Container w="100vw" minW="100vw">
        <Flex
          direction={['column', 'column', 'row']}
          justify="space-between"
          align="center"
          py={4}
          gap={4}
        >
          <Link
            as={NextLink}
            href="/"
            {...growShrinkProps}
            mb={{ base: 5, md: 0 }}
          >
            <Flex align="center">
              <Box as={FaSwimmingPool} boxSize={8} mr={4} />
              <Box as="h1" fontSize={['xl', '2xl']} fontWeight="bold" flex="1">
                PRIVACY POOLS
              </Box>
            </Flex>
          </Link>

          <Flex gap={{ base: 2, md: 4 }}>
            <NoteWalletConnectButton />
            <ConnectButton
              accountStatus="address"
              chainStatus="icon"
              showBalance={{
                smallScreen: true,
                largeScreen: true
              }}
            />
          </Flex>
        </Flex>

        <Flex justifyContent="center">
          <Container mt={5} px={0}>
            <Flex
              boxShadow="dark-lg"
              backdropBlur="8px"
              bg="rgb(23,25,35)"
              bgGradient="linear-gradient(0deg, rgba(23,25,35,1) 54%, rgba(45,55,72,1) 97%)"
              borderRadius="10px"
              fontWeight="bold"
              justifyContent="center"
              alignItems="center"
              overflow="visible"
              color="white"
            >
              <Stack
                width="100%"
                justify={['space-evenly']}
                alignItems="center"
                direction="row"
                px={0}
                py={2}
                gap={[0, 3, 10]}
                maxH="50px"
              >
                <Link
                  as={NextLink}
                  fontSize={['xs', 'md']}
                  href="/stats"
                  style={linkStyle('/stats')}
                  {...growShrinkProps}
                >
                  Stats
                </Link>
                <Link
                  as={NextLink}
                  fontSize={['xs', 'md']}
                  href="/deposit"
                  style={linkStyle('/deposit')}
                  {...growShrinkProps}
                >
                  Deposit
                </Link>
                <Link
                  as={NextLink}
                  fontSize={['xs', 'md']}
                  href="/withdraw"
                  style={linkStyle('/withdraw')}
                  {...growShrinkProps}
                >
                  Withdraw
                </Link>
                <Link
                  as={NextLink}
                  fontSize={['xs', 'md']}
                  href="/explorer"
                  style={linkStyle('/explorer')}
                  {...growShrinkProps}
                >
                  Explorer
                </Link>
              </Stack>
            </Flex>
          </Container>
        </Flex>
      </Container>
    </>
  );
};

export default HeaderNavbar;
