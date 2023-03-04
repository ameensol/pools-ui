import {
  Box,
  Heading,
  Text,
  Tag,
  Flex,
  Link,
  Avatar,
  Icon,
  TagLabel,
  Divider,
  useClipboard,
  Tooltip
} from '@chakra-ui/react';
import { useState } from 'react';

import { AiOutlineCopyright } from 'react-icons/ai';
import { FiExternalLink } from 'react-icons/fi';
import { FaTwitter, FaGithub } from 'react-icons/fa';

interface ClickToCopyAddressProps {
  tagImage: string;
  tagLabel: string;
  onCopyCall: () => void;
}

const ClickToCopyAddress: React.FC<ClickToCopyAddressProps> = ({
  tagImage,
  tagLabel,
  onCopyCall
}) => {
  const [tooltipText, setTooltipText] = useState('Click to copy address');

  const handleCopyAddress = () => {
    onCopyCall();
    setTooltipText(`Copied ${tagLabel} to clipboard!`);
    setTimeout(() => {
      setTooltipText('Click to copy address');
    }, 2000);
  };

  return (
    <Tooltip label={tooltipText}>
      <Tag
        size={{ base: 'sm', md: 'md' }}
        bg="gray.700"
        color="gray.200"
        borderRadius="full"
        py={1}
        mx={1}
        onClick={handleCopyAddress}
        _hover={{ cursor: 'pointer' }}
      >
        <Avatar src={tagImage} size="xs" name="dnsNameTwo.eth" ml={-1} mr={2} />
        <TagLabel>{tagLabel}</TagLabel>
      </Tag>
    </Tooltip>
  );
};

const Footer: React.FC = () => {
  const devAddress1 = 'ameensol.eth';
  const { copied: copied1, onCopy: onCopyAdd1 }: any =
    useClipboard(devAddress1);

  return (
    <Box>
      <Box
        pt="5rem"
        display="flex"
        flexDirection="column"
        textAlign="center"
        justifyContent="center"
        alignItems="center"
        bg="rgb(23,25,35)"
        bgGradient="linear-gradient(0deg, rgba(23,25,35,1) 54%, rgba(45,55,72,1) 97%)"
        color="white"
      >
        <Box width={{ base: '80%', md: '40%' }} mb={20}>
          <Box
            bg="black"
            color="gray.200"
            border="3px solid gray"
            borderRadius={20}
            px={8}
            py={10}
          >
            <Text textAlign="left">
              &quot;The best known cryptographic problem is that of privacy:
              preventing the unauthorized extraction of information from
              communications over an insecure channel.&quot;
            </Text>

            <Text fontWeight="bold" textAlign="right" mt={4}>
              - Diffie and Hellman, &quot;New Directions in Cryptography&quot;
              1976
            </Text>
          </Box>
        </Box>

        <Flex
          mt={10}
          alignItems="center"
          fontSize={{ base: 'md', md: 'xl' }}
          justifyContent="center"
          color="gray.400"
          px={2}
        >
          This work is made possible by
          <Link href="https://github.com" isExternal ml={2} color="white">
            MolochDAO
            <Icon as={FiExternalLink} boxSize={4} ml={1} />
          </Link>
        </Flex>
        <Heading as="h1" size="2xl" mb="1rem" mt={2} px={5}>
          Built from the ground up. Built on Ethereum. Deployed on Optimism.
        </Heading>
      </Box>
      <Box
        as="footer"
        mt="auto"
        pb={10}
        textAlign="center"
        w="100%"
        bg="gray.900"
        color="gray.400"
      >
        <Flex direction="column" alignItems="center">
          <Divider
            orientation="horizontal"
            h="1px"
            w="60%"
            bg="gray.500"
            my={5}
          />

          <Flex alignItems="center">
            <AiOutlineCopyright />
            <Text fontSize="lg" ml={1}>
              Privacy Pools,
            </Text>
            <Text fontSize="lg">2023</Text>
          </Flex>
          <Flex alignItems="center" mt={2}>
            <Text fontSize="xs" color="gray.500" mr={2}>
              ALL RIGHTS RESERVED
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
