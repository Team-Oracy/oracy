import React, { useRef, useEffect, useState } from "react";

const Scrubber = ({
  track,
  elapsedTime,
  duration,
  onScrubStarted,
  onScrubEnded,
}) => {
  const [percentage, setPercentage] = useState(elapsedTime / duration);
  const playerScrubberRef = useRef();
  const playerScrubberThumbRef = useRef();
  const playerScrubberBarActiveRef = useRef();
  const previousElapsedTimeRef = useRef(0);
  const previousDurationRef = useRef(0);

  useEffect(() => {
    if (elapsedTime > 0) previousElapsedTimeRef.current = elapsedTime;
    if (duration > 0) previousDurationRef.current = duration;

    setPercentage(previousElapsedTimeRef.current / previousDurationRef.current);
  }, [elapsedTime, duration]);

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

  function setProgress(percentage) {
    const playerScrubberWidth = playerScrubberRef.current.clientWidth;
    const xPos = percentage * playerScrubberWidth;
    requestAnimationFrame(() => {
      playerScrubberBarActiveRef.current.style.width = `${xPos}px`;
      playerScrubberThumbRef.current.style.transform = `translateX(${xPos}px)`;
    });
  }

  function fancyTimeFormat(time) {
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);

  useEffect(() => {
    setProgress(percentage);
  }, []);
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
      <div className="playerScrubberTrackInfo">
        <div className="playerScrubberTrackInfoProgress">
          {fancyTimeFormat(elapsedTime || previousElapsedTimeRef.current)}
        </div>
        <div className="playerScrubberTrackInfoName">{track}</div>
        <div className="playerScrubberTrackInfoCountdown">
          {`- ${fancyTimeFormat(
            duration - elapsedTime ||
              previousDurationRef.current - previousElapsedTimeRef.current
          )}`}
        </div>
      </div>
    </div>
  );
};
export default Scrubber;
