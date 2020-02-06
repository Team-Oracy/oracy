import RewindIcon from "../public/icons/rewind-10.svg";
import LoadingIcon from "../public/icons/loading.svg";
import PlayIcon from "../public/icons/play.svg";
import PauseIcon from "../public/icons/pause.svg";
import ForwardIcon from "../public/icons/fast-forward-10.svg";
import ChevronDownIcon from "../public/icons/chevron-down.svg";
import { useEffect, useState, useRef } from "react";
import AudioPlayer from "../utils/audioPlayer";

const Player = ({ book, isPlaying = false, isAudioLoading = false }) => {
  const [bookState, setBookState] = useState();
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [isAudioLoadingState, setIsAudioLoadingState] = useState(false);
  const [isUserScrubbing, setIsUserScrubbing] = useState(false);
  const [theInterval, setTheInterval] = useState(null);
  const playerScrubberBarActiveRef = useRef();
  const playerScrubberThumbRef = useRef();
  const playerScrubberRef = useRef();

  function playerScrub(e) {
    e.stopPropagation();
    e.preventDefault();
    setIsUserScrubbing(true);
    clearInterval(theInterval);
    setTheInterval(null);
    const xPos = e.pageX - playerScrubberRef.current.offsetLeft;
    updateScrubUIWithXPosition(xPos);
    const htmlElem = document.getElementsByTagName("html")[0];
    htmlElem.addEventListener("mousemove", scrubbing);
    htmlElem.addEventListener("mouseup", scrubbed);
  }

  function setScrubPosition() {
    requestAnimationFrame(() => {
      if (!isUserScrubbing && playerScrubberRef.current) {
        const elapsed = AudioPlayer.getCurrentPosition();
        const percentage = elapsed / AudioPlayer.getDuration();
        const playerScrubberWidth = playerScrubberRef.current.clientWidth;
        const xPos = percentage * playerScrubberWidth;

        playerScrubberBarActiveRef.current.style.width = `${xPos}px`;
        playerScrubberThumbRef.current.style.transform = `translateX(${xPos}px)`;
      }
    });
  }

  function scrubbing(e) {
    const xPos = e.pageX - playerScrubberRef.current.offsetLeft;
    updateScrubUIWithXPosition(xPos);
  }

  function scrubbed(e) {
    setIsUserScrubbing(false);
    const htmlElem = document.getElementsByTagName("html")[0];
    htmlElem.removeEventListener("mousemove", scrubbing);
    htmlElem.removeEventListener("mouseup", scrubbed);
    const xPos = e.pageX - playerScrubberRef.current.offsetLeft;
    const scrubPercentage = updateScrubUIWithXPosition(xPos);
    // Set audio seek to new position
    const duration = AudioPlayer.getDuration();
    AudioPlayer.seek(scrubPercentage * duration);
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
    if (isFullPlayer) setScrubPosition();
    let xDown, yDown;

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }
    function getTouches(evt) {
      return evt.touches;
    }

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var yUp = evt.touches[0].clientY;

      var yDiff = yDown - yUp;

      if (yDiff < 0) {
        if (isFullPlayer) setIsFullPlayer(false);
      }

      /* reset values */
      xDown = null;
      yDown = null;
    }
    if (isFullPlayer) {
      document.addEventListener("touchstart", handleTouchStart, false);
      document.addEventListener("touchmove", handleTouchMove, false);
    } else {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    }
  }, [isFullPlayer]);

  useEffect(() => {
    setBookState(book);
    setIsPlayingState(isPlaying);
    setIsAudioLoadingState(isAudioLoading);
  }, [book, isPlaying, isAudioLoading]);

  useEffect(() => {
    if (!isUserScrubbing && isPlayingState && theInterval === null) {
      setTheInterval(setInterval(setScrubPosition, 1000));
    }
    if (isUserScrubbing) {
      clearInterval(theInterval);
      setTheInterval(null);
    }

    return () => {
      clearInterval(theInterval);
      setTheInterval(null);
    };
  }, [isUserScrubbing, isPlayingState]);

  const playerClassnames = `player ${isFullPlayer ? "-full" : "-mini"} ${
    isPlayingState ? "-playing" : ""
  } ${isAudioLoadingState ? "-loading" : ""}`;
  return bookState && true ? (
    <div className={playerClassnames} id="player">
      <div
        className="playerMain"
        onClick={() => !isFullPlayer && setIsFullPlayer(!isFullPlayer)}
      >
        <img
          className="playerCoverImage"
          id="playerCoverImage"
          alt=""
          src={bookState.coverImageSrc}
        />
        <div className="playerInfoControls">
          <div className="playerInfo">
            <div className="playerTitle" id="playerTitle">
              {bookState.title}
            </div>
            <div className="playerAuthor" id="playerAuthor">
              {bookState.author}
            </div>
          </div>
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
                style={{ width: 100 }}
                ref={playerScrubberBarActiveRef}
                className="playerScrubberBarActive"
                id="playerScrubberBarActive"
              ></div>
            </div>
          </div>
          <div className="playerControls">
            <div
              className="playerControlsRewind"
              id="playerControlsRewind"
              title="Rewind 10 seconds"
              onClick={e => {
                e.stopPropagation();
                AudioPlayer.skip(-10);
              }}
            >
              <RewindIcon />
            </div>
            <div
              className="playerControlsPlayPause"
              onClick={e => {
                e.stopPropagation();
                if (isPlaying) AudioPlayer.pause();
                else AudioPlayer.resume();
              }}
            >
              <div className="playerControlsLoading" title="Loading">
                <LoadingIcon />
              </div>
              <div
                className="playerControlsPlay"
                id="playerControlsPlay"
                title="Play"
              >
                <PlayIcon />
              </div>
              <div
                className="playerControlsPause"
                id="playerControlsPause"
                title="Pause"
              >
                <PauseIcon />
              </div>
            </div>
            <div
              className="playerControlsForward"
              id="playerControlsForward"
              title="Forward 10 seconds"
              onClick={e => {
                e.stopPropagation();
                AudioPlayer.skip(10);
              }}
            >
              <ForwardIcon />
            </div>
          </div>
        </div>
      </div>
      <div
        className="playerCollapse"
        id="playerCollapse"
        title="Collapse"
        onClick={() => setIsFullPlayer(!isFullPlayer)}
      >
        <div>
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  ) : null;
};

export default Player;
