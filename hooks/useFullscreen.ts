import { useState, useLayoutEffect, useCallback, RefObject } from 'react';

export const useFullscreen = (ref: RefObject<HTMLElement>) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => !!document.fullscreenElement);

  const enterFullscreen = useCallback(async () => {
    if (ref.current && !document.fullscreenElement) {
      try {
        await ref.current.requestFullscreen();
      } catch (error) {
        console.error("Failed to enter fullscreen:", error);
      }
    }
  }, [ref]);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Failed to exit fullscreen:", error);
      }
    }
  }, []);

  useLayoutEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return { isFullscreen, enterFullscreen, exitFullscreen };
};
