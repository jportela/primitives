import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

/**
 * A ref may be reassigned. This gives us the up to date DOM node
 * via state for use in useEffect dependencies.
 */
function useNode<T>(ref: React.RefObject<T>) {
  const [node, setNode] = React.useState<T | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setNode(ref.current);
  });

  return node;
}

export { useNode };
