import { useEffect, useState } from 'react';


const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);

    // cleanup function for the hook when consumer component dismounts
    return () => { resizeObserver.unobserve(observeTarget); };
  }, [ref]);

  return dimensions;
};


export default useResizeObserver;
