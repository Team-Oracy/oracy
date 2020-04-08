import React, { useRef, useEffect } from "react";

const Scrubber = ({ percentage }) => {
  const playerScrubberRef = useRef();
  const playerScrubberThumbRef = useRef();
  const playerScrubberBarActiveRef = useRef();

  useEffect(() => {
    const playerScrubberWidth = playerScrubberRef.current.clientWidth;
    const xPos = percentage * playerScrubberWidth;
    requestAnimationFrame(() => {
      playerScrubberBarActiveRef.current.style.width = `${xPos}px`;
      playerScrubberThumbRef.current.style.transform = `translateX(${xPos}px)`;
    });
  }, [percentage]);

  const playerScrub = () => {};
  return (
    <div
      className="playerScrubber"
      id="playerScrubber"
      data-position="0"
      ref={playerScrubberRef}
      onMouseDown={playerScrub}
    >
      <div
        className="playerScrubberThumb"
        id="playerScrubberThumb"
        ref={playerScrubberThumbRef}
      ></div>
      <div className="playerScrubberBar">
        <div
          style={{
            width: 100
          }}
          ref={playerScrubberBarActiveRef}
          className="playerScrubberBarActive"
          id="playerScrubberBarActive"
        ></div>
      </div>
    </div>
  );
};
export default Scrubber;
