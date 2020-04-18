import React, { useRef, useEffect } from "react";

const Scrubber = ({ percentage, onScrubStarted, onScrubEnded }) => {
  const playerScrubberRef = useRef();
  const playerScrubberThumbRef = useRef();
  const playerScrubberBarActiveRef = useRef();
  function playerScrub(e) {
    e.stopPropagation();
    e.preventDefault();
    onScrubStarted();
    const xPos = e.pageX - playerScrubberRef.current.offsetLeft;
    updateScrubUIWithXPosition(xPos);
    const htmlElem = document.getElementsByTagName("html")[0];
    htmlElem.addEventListener("mousemove", scrubbing);
    htmlElem.addEventListener("mouseup", scrubbed);
  }

  function scrubbing(e) {
    const xPos = e.pageX - playerScrubberRef.current.offsetLeft;
    updateScrubUIWithXPosition(xPos);
  }

  function scrubbed(e) {
    // setIsUserScrubbing(false);
    const htmlElem = document.getElementsByTagName("html")[0];
    htmlElem.removeEventListener("mousemove", scrubbing);
    htmlElem.removeEventListener("mouseup", scrubbed);
    const xPos = e.pageX - playerScrubberRef.current.offsetLeft;
    const scrubPercentage = updateScrubUIWithXPosition(xPos);
    onScrubEnded(scrubPercentage);
  }

  function updateScrubUIWithXPosition(xPos) {
    const playerScrubberWidth = playerScrubberRef.current.clientWidth;
    if (xPos < 0) {
      xPos = 0;
    } else if (xPos > playerScrubberWidth) {
      xPos = playerScrubberWidth;
    }
    playerScrubberBarActiveRef.current.style.width = `${xPos}px`;
    playerScrubberThumbRef.current.style.transform = `translateX(${xPos}px)`;
    const scrubPercentage = xPos / playerScrubberWidth;
    return scrubPercentage;
  }

  useEffect(() => {
    const playerScrubberWidth = playerScrubberRef.current.clientWidth;
    const xPos = percentage * playerScrubberWidth;
    requestAnimationFrame(() => {
      playerScrubberBarActiveRef.current.style.width = `${xPos}px`;
      playerScrubberThumbRef.current.style.transform = `translateX(${xPos}px)`;
    });
  }, [percentage]);

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
            width: 100,
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
