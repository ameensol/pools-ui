import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { wasmBytesAtom, zkeyBytesAtom } from '../state';

export function useZKeys() {
  const [wasmBytes, setWasmBytes] = useAtom(wasmBytesAtom);
  const [zkeyBytes, setZkeyBytes] = useAtom(zkeyBytesAtom);

  useEffect(() => {
    if (wasmBytes.data.length === 0) {
      fetch(`/withdraw_from_subset_simple.wasm`)
        .then((res) => res.arrayBuffer())
        .then((buff) => {
          setWasmBytes({
            type: 'mem',
            data: Buffer.from(buff)
          });
        });
    }

    if (zkeyBytes.data.length === 0) {
      fetch(`/withdraw_from_subset_simple_final.zkey`)
        .then((res) => res.arrayBuffer())
        .then((buff) => {
          setZkeyBytes({
            type: 'mem',
            data: Buffer.from(buff)
          });
        });
    }
  }, [wasmBytes, setWasmBytes, zkeyBytes, setZkeyBytes]);

  return { zkeyBytes, wasmBytes };
}
