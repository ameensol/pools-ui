import React from 'react';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function PasswordInput({
  placeholder,
  name,
  isInvalid,
  isDisabled
}: {
  placeholder: string;
  name: string;
  isInvalid: boolean;
  isDisabled?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="lg" alignItems="center" my={2}>
      <Input
        size="lg"
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        isInvalid={isInvalid || false}
        isDisabled={isDisabled}
        fontSize="sm"
        color="gray.800"
        bg="gray.50"
        focusBorderColor="gray.400"
        alignItems="center"
      />
      <InputRightElement width="4.5rem">
        <Button size="md" onClick={handleClick} variant="ghost">
          {show ? <ViewIcon /> : <ViewOffIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
