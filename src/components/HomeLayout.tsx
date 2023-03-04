import React from 'react';
import {
  Box,
  BoxProps,
  Container,
  Link,
  Heading,
  Flex,
  Stack
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';

const growShrinkProps = {
  _hover: {
    transform: 'scale(1.025)'
  },
  _active: {
    transform: 'scale(0.95)'
  },
  transition: '0.125s ease'
};

interface LayoutProps extends BoxProps {
  children?: React.ReactNode;
  title?: string;
}

export const HomeLayout: React.FC<LayoutProps> = ({
  title,
  children,
  ...boxProps
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Container maxW="98vw" minW="216px">
        <Flex
          direction={['column', 'column', 'row']}
          justify="space-between"
          align="center"
          m={4}
          gap={4}
        >
          <Heading size="lg">🌊 Privacy Pools</Heading>
          <Container w="fit-content">
            <Stack
              color="blue.800"
              fontWeight="bold"
              justifyContent="center"
              alignItems="center"
              direction={['column', 'row']}
              px={8}
              py={2}
              gap={[0, 8]}
            >
              <Link as={NextLink} href="/stats" {...growShrinkProps}>
                Stats
              </Link>

              <Link as={NextLink} href="/deposit" {...growShrinkProps}>
                Deposit
              </Link>

              <Link as={NextLink} href="/withdraw" {...growShrinkProps}>
                Withdraw
              </Link>

              <Link as={NextLink} href="/explorer" {...growShrinkProps}>
                Explorer
              </Link>
            </Stack>
          </Container>
        </Flex>
      </Container>

      <Box {...boxProps}>{children}</Box>
    </>
  );
};

export default HomeLayout;
