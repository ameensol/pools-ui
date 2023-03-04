import { Box } from '@chakra-ui/react';
import HeroSection from '../components/LandingPage/HeroSection';
import InfoSection from '../components/LandingPage/InfoSection';
import NavBar from '../components/LandingPage/NavBar';
import Footer from '../components/LandingPage/Footer';

/**
 *
 * css-gradient: https://cssgradient.io/
 */

const Page = () => {
  return (
    <Box w="100vw" h="100vh" mt="0" m="auto">
      <Box
        maxW="100vw"
        px={{ base: 10, md: 40 }}
        alignItems="center"
        // bgGradient="linear-gradient(220deg, rgba(172,186,246,0.68) 17%, rgba(0,212,255,0.6) 77%, rgba(139,231,224,0.8) 97%)"
        // bgGradient="linear-gradient(45deg, #b8faf4 0%, #a8bdfc 25%, #c5b0f6 50%, #ffe5f9 75%, #f0ccc3 100%)"
        bgGradient="linear-gradient(45deg, #b8faf480 0%, #a8bdfc80 25%, #c5b0f680 50%, #ffe5f980 75%, #f0ccc380 100%)"
      >
        <NavBar />
        <HeroSection />
        <InfoSection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Page;
