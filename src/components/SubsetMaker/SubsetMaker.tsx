import { ExternalLinkIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Button, Container, Heading, HStack,
  Link, Switch, Text, Tooltip, VStack
} from '@chakra-ui/react';
import { hexZeroPad } from 'ethers/lib/utils';
import { useAtom } from 'jotai';
import * as _ from 'lodash';
import NextLink from 'next/link';
import { AccessList, SubsetData } from 'pools-ts';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { useAccessList, useNote } from '../../hooks';
import { commitmentsAtom } from '../../state';
import { growShrinkProps, pinchString } from '../../utils';

export function SubsetMaker() {
  const [subsetData, setSubsetData] = useState<SubsetData>([]);
  const [commitments] = useAtom(commitmentsAtom);
  const { chain } = useNetwork();
  const { commitment } = useNote();
  // const { commitments } = useCommitments()
  const { accessList, setAccessList } = useAccessList();

  useEffect(() => {
    if (subsetData.length === 0) {
        setSubsetData(
          accessList.getWindow(0, accessList.length)
        );
    }
  }, [subsetData, accessList]);

  const syncChecked = (e: any) => {
    e.preventDefault();
    const index = Number(e.target.id);
    if (index >= subsetData.length) return;
    const _subsetData = [...subsetData];
    if (_subsetData[index] === 1) {
      _subsetData[e.target.id] = 0;
    } else {
      _subsetData[e.target.id] = 1;
    }
    setSubsetData(_subsetData);
  };

  const syncAccessList = () => {
    let start: number = 0;
    let end: number = accessList.length;

    if (!_.isEqual(accessList.getWindow(start, end), subsetData)) {
      const _accessList = AccessList.fromJSON(accessList.toJSON());
      _accessList.setWindow(start, end, subsetData);
      setAccessList(_accessList);
    }
  };

  const isSyncDisabled = _.isEqual(
    subsetData,
    accessList.getWindow(
      0,
      accessList.length
    )
  );

  return (
    <Container px={2} centerContent gap={2}>
      <HStack mb={4}>
        <Tooltip label="Exclude some of the most recent deposits by optionally checking the corresponding slider. The demo blocklist contains a list of the most recent deposits, 30 at most.">
          <QuestionOutlineIcon />
        </Tooltip>
        <Heading size="md">Exclude some deposits</Heading>
      </HStack>

      <Container bg="blue.50" borderRadius={8} p={4}>
        <Heading size="sm">Subset Root</Heading>
        <Text
          fontSize="xs"
          color="blue.800"
          fontWeight="bold"
          mt={2}
          textAlign="center"
        >
          {accessList?.root.toHexString()}
        </Text>
        {!isSyncDisabled && (
          <HStack justify="center" mt={2}>
            <Container centerContent gap={2} pt={2}>
              <Text fontSize="xs" color="orange.500">
                Warning: unsynced changes!
              </Text>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={syncAccessList}
                isDisabled={isSyncDisabled}
              >
                Sync
              </Button>
            </Container>
          </HStack>
        )}
      </Container>

      <Container
        mt={2}
        w="full"
        bg="blue.50"
        borderRadius={8}
        centerContent
        p={4}
      >
        <VStack w="full">
          <HStack w="full" mb={2}>
            <Container w="10%" centerContent p={0}>
              <Heading size="sm">#</Heading>
            </Container>
            <Container w="20%" centerContent p={0}>
              <Heading size="sm">block?</Heading>
            </Container>
            <Container w="30%" centerContent p={0}>
              <Heading size="sm">sender</Heading>
            </Container>
            <Container w="40%" centerContent p={0}>
              <Heading size="sm">commitment</Heading>
            </Container>
          </HStack>

          <Container p={0} centerContent overflowY="auto" maxH="50vh">
            {!commitment.eq(0) &&
              commitments.length > 0 &&
              commitments.map((commitmentData, i) => {
                return (
                  <HStack key={`row-${i}-${commitmentData.leafIndex}`} w="full">
                    <Container centerContent p={0} w="10%">
                      <Text
                        key={`leafIndex-${i}-${commitmentData.leafIndex}`}
                        fontSize="sm"
                        textAlign="left"
                      >
                        {commitmentData.leafIndex.toString()}
                      </Text>
                    </Container>

                    <Container centerContent p={0} w="20%">
                      <Switch
                        key={`switch-${i}-${commitmentData.leafIndex}`}
                        id={`${i}`}
                        isDisabled={commitment.eq(commitmentData.commitment)}
                        isChecked={Boolean(subsetData[i])}
                        onChange={syncChecked}
                      />
                    </Container>

                    <Container
                      key={`container-${i}-${commitmentData.leafIndex}`}
                      w="30%"
                      p={0}
                      centerContent
                    >
                      <Link
                        key={`link-${i}-${commitmentData.leafIndex}`}
                        as={NextLink}
                        href={`${chain?.blockExplorers?.default.url}/address/${commitmentData.sender}`}
                        isExternal
                        {...growShrinkProps}
                      >
                        <HStack>
                          <Text
                            key={`sender-${i}-${commitmentData.sender}`}
                            color="blue.700"
                            fontSize="sm"
                            textAlign="left"
                            {...growShrinkProps}
                          >
                            {pinchString(commitmentData.sender.toString(), 4)}
                          </Text>
                          <Text color="blue.700" fontSize="sm" pb="4px">
                            <ExternalLinkIcon key={`external-link-icon-${i}`} />
                          </Text>
                        </HStack>
                      </Link>
                    </Container>

                    <Container centerContent p={0} w="40%">
                      <Text
                        key={`commitment-${i}-${commitmentData.commitment}`}
                        fontSize="sm"
                        textAlign="left"
                      >
                        {pinchString(
                          hexZeroPad(commitmentData.commitment.toString(), 32),
                          6
                        )}
                      </Text>
                    </Container>
                  </HStack>
                );
              })}
          </Container>
        </VStack>
      </Container>
    </Container>
  );
}

export default SubsetMaker;
