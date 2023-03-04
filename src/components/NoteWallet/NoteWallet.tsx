import React from 'react';

import { useAtom } from 'jotai';
import { stageAtom } from '../../state/atoms';

import Manage from './Manage';
import Create from './Create';
import Unlock from './Unlock';
import Connect from './Connect';

export function NoteWallet() {
  const [stage] = useAtom(stageAtom);

  return (
    <>
      {(function () {
        switch (stage) {
          case 'Connect':
            return <Connect />;
          case 'Manage':
            return <Manage />;
          case 'Create':
            return <Create />;
          case 'Unlock':
            return <Unlock />;
          default:
            return null;
        }
      })()}
    </>
  );
}

export default NoteWallet;
