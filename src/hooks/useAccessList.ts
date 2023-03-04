import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { AccessList } from 'pools-ts';
import { accessListAtom } from '../state';
import { useCommitments, useDebounce } from '../hooks';

export function useAccessList() {
  const [accessList, setAccessList] = useAtom(accessListAtom);
  const { commitments } = useCommitments();
  const debouncedCommitments = useDebounce(commitments, 500);

  useEffect(() => {
    // initialize or extend
    if (
      Array.isArray(debouncedCommitments) &&
      debouncedCommitments.length > 0
    ) {
      if (
        accessList.length === 0 ||
        accessList.length > debouncedCommitments.length
      ) {
        const _accessList = AccessList.fullEmpty({
          accessType: 'blocklist',
          subsetLength: debouncedCommitments.length
        });
        setAccessList(_accessList);
      } else if (accessList.length < debouncedCommitments.length) {
        let _accessList: AccessList;
        if (debouncedCommitments.length >= 30) {
          _accessList = AccessList.fullEmpty({
            accessType: 'blocklist',
            subsetLength: debouncedCommitments.length
          });
          let start = _accessList.length - 30;
          let end = accessList.length;
          if (start >= 0 && start < end) {
            _accessList.setWindow(start, end, accessList.getWindow(start, end));
          }
        } else {
          _accessList = AccessList.fromJSON(accessList.toJSON());
          _accessList.extend(debouncedCommitments.length);
        }
        setAccessList(_accessList);
      }
    }
  }, [accessList, debouncedCommitments, setAccessList]);

  return { accessList, setAccessList };
}
