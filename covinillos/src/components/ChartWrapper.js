import React, { useEffect, useRef, useState } from 'react';


export default function ChartWrapper(props) {
  const [dimensions, setDimensions] = useState(null);
  const wrapperRef = useRef();

  useEffect(() => {
    const observeTarget = wrapperRef.current;
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        // we only need the width, adding the height triggers a rerender
        console.log('entry.contentRect.width', entry.contentRect.width);

        setDimensions({ width: entry.contentRect.width });
      });
    });

    resizeObserver.observe(observeTarget);

    // cleanup function for the hook when consumer component dismounts
    return () => { resizeObserver.unobserve(observeTarget); };
  }, [wrapperRef]);

  return (
    <div className="chart-wrapper" ref={wrapperRef}>
      {dimensions ? React.cloneElement(props.children, {dimensions}) : null}
    </div>
  );
}
