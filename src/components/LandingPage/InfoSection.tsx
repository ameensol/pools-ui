import { useState, ReactElement, JSXElementConstructor } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Collapse,
  Button,
  Center,
  Link,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa';
import { VscDebugStart } from 'react-icons/vsc';
import { HiOutlineBeaker } from 'react-icons/hi';
import { FiSettings } from 'react-icons/fi';
import { AiOutlineLock, AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

interface ListItemProps {
  icon: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  text: string;
  paragraph: string;
}

function ListItem({ icon, text, paragraph }: ListItemProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Flex align="center">
      <Box display={{ base: 'none', md: 'block' }}>
        <IconButton
          icon={icon}
          aria-label="info"
          size="md"
          onClick={handleOpen}
          mx={5}
          borderRadius="50%"
          color="white"
          bg="black"
          _hover={{
            bg: 'gray.200',
            color: 'black',
            border: '4px solid black'
          }}
        />
      </Box>
      <Flex
        direction="column"
        // onMouseEnter={handleOpen}
        // onMouseLeave={handleOpen}
        p={4}
        borderRadius={8}
        border="4px solid"
        bg="gray.100"
        boxShadow="lg"
        my={2}
        w="60vw"
        _hover={{
          cursor: 'pointer',
          bg: 'white',
          color: 'black'
        }}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Text ml={2} fontWeight="bold">
            {text}
          </Text>
          {isOpen ? (
            <AiOutlineUp size="20px" fontWeight="bold" />
          ) : (
            <AiOutlineDown size="20px" fontWeight="bold" />
          )}
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <Box my={4} p={4} rounded="md">
            <Text fontSize="sm" lineHeight="tall">
              {paragraph}
            </Text>
          </Box>
        </Collapse>
      </Flex>
    </Flex>
  );
}

const InfoSection = () => {
  const btnPadding = useBreakpointValue({ base: '20px', lg: '30px' });
  const btnFontSize = useBreakpointValue({ base: 'xs', sm: 'md', lg: 'lg' });

  return (
    <Box pb={20}>
      <Center>
        <Flex
          direction="column"
          alignItems="center"
          w={{ base: '90%', md: '70%' }}
          my={30}
        >
          <Text fontSize={{ base: 'md', md: 'xl' }} mt={10} textAlign="center">
            Introducing a demonstration in
          </Text>
          <Text
            fontSize={{ base: '2xl', md: '5xl' }}
            fontWeight="bold"
            textAlign="center"
          >
            SELF.SOLVEREIGN.ANONYMITY
          </Text>
          <Text fontSize={{ base: 'md', md: 'xl' }} mb={20} textAlign="center">
            A no compromise solution to credibly neutral privacy for Ethereum
          </Text>
          <ListItem
            icon={<AiOutlineLock />}
            text="Protect Your Privacy"
            paragraph="Privacy Pools are designed to break the link between your original deposit address and your new withdrawal address. By depositing your funds into a common pool and leaving a cryptographic commitment to a secret value, you can withdraw your funds using a zero-knowledge proof that ensures your new withdrawal address is entirely new and unlinkable. With Privacy Pools, your transaction history remains private and untraceable."
          />
          <ListItem
            icon={<FiSettings />}
            text="Customize Your Privacy Sets"
            paragraph="The privacy protocol allows for configurable privacy sets that enable honest users to exclude hackers and bad actors from their transactions. This makes it difficult for money launderers to take advantage of the system. You can choose to exclude anyone you don't trust from your privacy sets, ensuring that your transactions are secure and private."
          />
          <ListItem
            icon={<HiOutlineBeaker />}
            text="Conduct Open Source Research"
            paragraph="Our decentralized privacy application is an open source research project that is dedicated to advancing the cause of privacy on the Ethereum blockchain. Our technology is open source and transparent, so you can be confident that your privacy is being protected by a community of experts and enthusiasts."
          />
          <ListItem
            icon={<VscDebugStart />}
            text="Get Started Today"
            paragraph="If you're looking for a privacy-preserving wallet that is both secure and easy to use, look no further than our decentralized privacy application. Try it today and experience the freedom and security of truly private transactions on the Ethereum blockchain."
          />
        </Flex>
      </Center>
      <Flex w="100%" justifyContent="center">
        <Flex
          mt={5}
          justifyContent="center"
          alignItems="center"
          direction={{ base: 'column', md: 'row' }}
        >
          <Link
            target="_blank"
            href="https://github.com/ameensol/privacy-pools"
            mr={{ base: 0, md: 10 }}
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            <Button
              mb={10}
              px={btnPadding}
              py={2}
              bg="gray.100"
              color="black"
              rounded="full"
              border="4px solid"
              _hover={{
                bg: 'black',
                color: 'white',
                borderColor: 'black',
                transform: 'scaleX(1.05)'
              }}
              transition="all 0.2s"
              fontWeight="semibold"
              boxShadow="xl"
              fontSize={btnFontSize}
              w="100%"
            >
              GO TO DOCS
            </Button>
          </Link>
          <Link
            target="_blank"
            href="/stats"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            <Button
              px={btnPadding}
              py={2}
              mb={10}
              bg="black"
              color="white"
              rounded="full"
              border="4px solid black"
              _hover={{
                bg: 'white',
                color: 'black',
                borderColor: 'black',
                transform: 'scaleX(1.05)'
              }}
              transition="all 0.2s"
              fontWeight="semibold"
              boxShadow="xl"
              fontSize={btnFontSize}
              w="100%"
            >
              GET PRIVACY NOW
            </Button>
          </Link>
          <Text display={{ base: 'block', md: 'none' }}>
            Open on Desktop for better experience.
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default InfoSection;
