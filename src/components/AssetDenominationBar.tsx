import {
  Container,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Select
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAtom } from 'jotai';
import { useOptions } from '../hooks';
import { assetAtom, denominationAtom } from '../state';

export function AssetDenominationBar() {
  const [asset, setAsset] = useAtom(assetAtom);
  const [denomination, setDenomination] = useAtom(denominationAtom);
  const { assetOptions, denominationOptions } = useOptions();

  return (
    <Stack direction={['row']}>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {denomination}
        </MenuButton>
        <MenuList>
          {denominationOptions.map((_denomination, i) => (
            <MenuItem
              value={_denomination}
              key={`${_denomination}-${i}-option`}
              onClick={() => setDenomination(_denomination.toString())}
            >
              {_denomination}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {asset}
        </MenuButton>
        <MenuList>
          {assetOptions.map((_asset, i) => (
            <MenuItem
              value={_asset}
              key={`${_asset}-${i}-option`}
              onClick={() => setAsset(_asset.toString())}
            >
              {_asset}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Stack>
  );
}
