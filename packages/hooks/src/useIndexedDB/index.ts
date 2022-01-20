import { useRef, useEffect } from 'react';
import useLatest from '../useLatest';
import useUnmount from '../useUnmount';
export interface Options {
  name: string;
  version?: number;
  onError?: IDBOpenDBRequestEventMap['error'];
  onSuccess?: IDBOpenDBRequestEventMap['success'];
  onUpgradeneeded?: IDBOpenDBRequestEventMap['upgradeneeded'];
  onBlocked?: IDBOpenDBRequestEventMap['blocked'];
}
const indexedDB =
  window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const useIndexedDB = (options: Options) => {
  const { name, version, onError, onSuccess, onUpgradeneeded, onBlocked } = options;
  const indexedDBRequestRef = useRef<IDBOpenDBRequest>();
  const unmountedRef = useRef(false);
  const onErrorRef = useLatest(onError);
  const onSuccessRef = useLatest(onSuccess);
  const onUpgradeneededRef = useLatest(onUpgradeneeded);
  const onBlockedRef = useLatest(onBlocked);
  const open = () => {
    let db;
    indexedDBRequestRef.current = indexedDB.open(name, version);
    indexedDBRequestRef.current.onsuccess = (event) => {
      if (unmountedRef.current) return;
      db = indexedDBRequestRef.current.result;
      onSuccessRef.current?.(event);
    };
    indexedDBRequestRef.current.onerror = (event) => {
      if (unmountedRef.current) return;
      onErrorRef.current?.(event);
    };
    indexedDBRequestRef.current.onupgradeneeded = (event) => {
      if (unmountedRef.current) return;
      onUpgradeneededRef.current?.(event);
    };
    indexedDBRequestRef.current.onblocked = (event) => {
      if (unmountedRef.current) return;
      onBlockedRef.current?.(event);
    };
  };
  useUnmount(() => {
    unmountedRef.current = true;
    disconnect();
  });
  useEffect(() => {
    open();
  }, []);
  return {
    indexedDBRequestIns: indexedDBRequestRef.current,
  };
};
export default useIndexedDB;
