/// <reference types="resize-observer-browser" />

import * as React from 'react';
import { useNode } from '@radix-ui/react-use-node';

function useSize(
  /** A reference to the element whose size to observe */
  refToObserve: React.RefObject<HTMLElement | SVGElement>
) {
  const [size, setSize] = React.useState<{ width: number; height: number } | undefined>(undefined);
  const node = useNode(refToObserve);

  React.useEffect(() => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }

        // Since we only observe the one element, we don't need to loop over the
        // array
        if (!entries.length) {
          return;
        }

        const entry = entries[0];
        let width: number;
        let height: number;

        if ('borderBoxSize' in entry) {
          const borderSizeEntry = entry['borderBoxSize'];
          // iron out differences between browsers
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize['inlineSize'];
          height = borderSize['blockSize'];
        } else {
          // for browsers that don't support `borderBoxSize`
          // we calculate a rect ourselves to get the correct border box.
          const rect = node.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
        }

        setSize({ width, height });
      });

      resizeObserver.observe(node, { box: 'border-box' });

      return () => {
        setSize(undefined);
        resizeObserver.unobserve(node);
      };
    }
    return;
  }, [node]);

  return size;
}

export { useSize };
