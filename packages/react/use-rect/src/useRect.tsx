import * as React from 'react';
import { observeElementRect } from '@radix-ui/rect';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { useNode } from '@radix-ui/react-use-node';

import type { Measurable } from '@radix-ui/rect';

/**
 * Use this custom hook to get access to an element's rect (getBoundingClientRect)
 * and observe it along time.
 */
function useRect(
  /** A reference to the element whose rect to observe */
  refToObserve: React.RefObject<Measurable>
) {
  const [rect, setRect] = React.useState<ClientRect>();
  const node = useNode(refToObserve);

  useLayoutEffect(() => {
    if (node) {
      const unobserve = observeElementRect(node, setRect);
      return () => {
        setRect(undefined);
        unobserve();
      };
    }
    return;
  }, [node]);
  return rect;
}

export { useRect };
