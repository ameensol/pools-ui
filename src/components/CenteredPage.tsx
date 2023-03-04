import { Flex, BoxProps } from '@chakra-ui/react';

interface CenteredPageProps extends BoxProps {
  children?: React.ReactNode;
}

export const CenteredPage: React.FC<CenteredPageProps> = ({
  children,
  ...boxProps
}) => {
  return (
    <>
      <Flex
        position="relative"
        wrap="wrap"
        top={0}
        bottom={0}
        w="100vw"
        // h={['calc(100vh - 308px)', 'calc(100vh - 160px)', 'calc(90vh - 112px)']}
        mt={[4, 0]}
        h={['auto', 'calc(100vh - 160px)', 'calc(90vh - 112px)']}
        align="center"
        justify="center"
        {...boxProps}
      >
        {children}
      </Flex>
    </>
  );
};

export default CenteredPage;
