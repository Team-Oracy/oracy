import React, { useState, useEffect, useRef, useContext } from "react";
import RewindIcon from "../../public/icons/rewind-10.svg";
import LoadingIcon from "../../public/icons/loading.svg";
import PlayIcon from "../../public/icons/play.svg";
import PauseIcon from "../../public/icons/pause.svg";
import ForwardIcon from "../../public/icons/fast-forward-10.svg";
import ChevronDownIcon from "../../public/icons/chevron-down.svg";
import Scrubber from "./scrubber";
import { AudioPlayerContext } from "../../pages";

const Player = ({ initialProgressPercentage }) => {
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [track, setTrack] = useState();
  const [duration, setDuration] = useState(0);
  const [currentBook, stateMachine, exposedPlayer] = useContext(
    AudioPlayerContext
  );

  let setProgress = useRef();

  useEffect(() => {
    if (stateMachine.matches("playing")) {
      setProgress.current = setInterval(() => {
        if (stateMachine.matches("playing")) {
          const {
            trackIndex,
            elapsedTime,
            duration,
          } = exposedPlayer.getProgress();

          setTrack(`Track ${trackIndex + 1}`);
          setElapsedTime(elapsedTime);
          setDuration(duration);
        }
      }, 1000);
    } else clearInterval(setProgress.current);
    return () => {
      clearInterval(setProgress.current);
    };
  }, [stateMachine.value]);

  const playerClassnames = `player ${isFullPlayer ? "-full" : "-mini"} ${
    stateMachine.matches("playing") ? "-playing" : ""
  } ${stateMachine.matches("loading") ? "-loading" : ""}`;

  return currentBook.id ? (
    <div className={playerClassnames} id="player">
      <div
        className="playerMain"
        onClick={() => !isFullPlayer && setIsFullPlayer(!isFullPlayer)}
      >
        <img
          className="playerCoverImage"
          id="playerCoverImage"
          alt=""
          src={currentBook.coverImageSrc}
        />

        <div className="playerInfoControls">
          <div className="playerInfo">
            <div className="playerTitle" id="playerTitle">
              {currentBook.title}
            </div>
            <div className="playerAuthor" id="playerAuthor">
              {currentBook.author}
            </div>
          </div>
          {isFullPlayer && (
            <Scrubber
              showDetailedInfo={!stateMachine.matches("loading")}
              initialPercentage={initialProgressPercentage}
              track={track}
              elapsedTime={elapsedTime}
              duration={duration}
              onScrubStarted={() => {
                exposedPlayer.sendEvent("SCRUB");
              }}
              onScrubEnded={(percentage) => {
                // Set audio seek to new position
                setTimeout(() => {
                  exposedPlayer.sendEvent("STOP_SCRUBBING", percentage);
                }, 0);
              }}
            ></Scrubber>
          )}
          <div className="playerControls">
            <div
              className="playerControlsRewind"
              id="playerControlsRewind"
              title="Rewind 10 seconds"
              onClick={(e) => {
                e.stopPropagation();
                exposedPlayer.sendEvent("PREVIOUS");
              }}
            >
              <RewindIcon />
            </div>
            <div
              className="playerControlsPlayPause"
              onClick={(e) => {
                e.stopPropagation();
                exposedPlayer.sendEvent("PLAY_PAUSE");
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
              onClick={(e) => {
                e.stopPropagation();
                exposedPlayer.sendEvent("FORWARD");
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
