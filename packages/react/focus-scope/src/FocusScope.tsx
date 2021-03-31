import * as React from 'react';
import { createFocusScope, AUTOFOCUS_ON_CREATE, AUTOFOCUS_ON_DESTROY } from './createFocusScope';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

type FocusScopeProps = {
  children: (args: { ref: React.RefCallback<any> }) => React.ReactElement;

  /**
   * Whether focus should be trapped within the FocusScope
   * (default: false)
   */
  trapped?: boolean;

  /**
   * Event handler called when auto-focusing on mount.
   * Can be prevented.
   */
  onMountAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when auto-focusing on unmount.
   * Can be prevented.
   */
  onUnmountAutoFocus?: (event: Event) => void;
};

function FocusScope(props: FocusScopeProps) {
  const { children, trapped = false } = props;
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  const [focusScope, setFocusScope] = React.useState<ReturnType<typeof createFocusScope>>();
  const onMountAutoFocus = useCallbackRef(props.onMountAutoFocus);
  const onUnmountAutoFocus = useCallbackRef(props.onUnmountAutoFocus);

  // Create the focus scope on mount and destroy it on unmount
  React.useEffect(() => {
    if (container) {
      container.addEventListener(AUTOFOCUS_ON_CREATE, onMountAutoFocus);
      container.addEventListener(AUTOFOCUS_ON_DESTROY, onUnmountAutoFocus);

      const focusScope = createFocusScope(container);
      setFocusScope(focusScope);

      return () => {
        container.removeEventListener(AUTOFOCUS_ON_CREATE, onMountAutoFocus);
        // We hit a react bug (fixed in v17) with focusing in unmount.
        // We need to delay the focus a little to get around it for now.
        // See: https://github.com/facebook/react/issues/17894
        setTimeout(() => {
          focusScope.destroy();
          // this needs to come after calling `destroy()` to make sure we can catch the event on time.
          container.removeEventListener(AUTOFOCUS_ON_DESTROY, onUnmountAutoFocus);
        }, 0);
      };
    }
  }, [container, onMountAutoFocus, onUnmountAutoFocus]);

  // Sync `trapped` prop imperatively rather than passing as an argument to
  // `createFocusScope()` so that we do not risk executing side-effects run
  // on create and destroy (focus side-effects) if it ever changes live.
  React.useEffect(() => {
    if (focusScope && trapped) {
      focusScope.trap();
      return () => focusScope.untrap();
    }
  }, [focusScope, trapped]);

  return children({ ref: React.useCallback((node) => setContainer(node), []) });
}

const Root = FocusScope;

export {
  FocusScope,
  //
  Root,
};
