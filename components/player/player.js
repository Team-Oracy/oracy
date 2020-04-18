import React, { useState, useEffect, useRef } from "react";
import RewindIcon from "../../public/icons/rewind-10.svg";
import LoadingIcon from "../../public/icons/loading.svg";
import PlayIcon from "../../public/icons/play.svg";
import PauseIcon from "../../public/icons/pause.svg";
import ForwardIcon from "../../public/icons/fast-forward-10.svg";
import ChevronDownIcon from "../../public/icons/chevron-down.svg";
import AudioPlayer from "../../utils/audioPlayer";

import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import Scrubber from "./scrubber";

const playerMachine = Machine({
  id: "audioPlayer",
  initial: "idle",
  states: {
    idle: {
      on: {
        PLAY_PAUSE: "loading",
      },
    },
    loading: {
      invoke: {
        src: "loadAudio",
        onDone: { target: "playing", actions: ["playAudio"] },
      },
    },
    playing: {
      on: {
        PLAY_PAUSE: "paused",
        SCRUB: "scrubbing_played",
        PREVIOUS: { target: "playing", actions: ["previous"] },
        FORWARD: { target: "playing", actions: ["forward"] },
      },
    },
    paused: {
      entry: "pauseAudio",
      on: {
        SCRUB: "scrubbing_paused",
        PLAY_PAUSE: "playing",
        PREVIOUS: { target: "paused", actions: ["previous"] },
        FORWARD: { target: "playing", actions: ["forward"] },
      },
    },
    scrubbing_played: {
      on: {
        STOP_SCRUBBING: "playing",
      },
    },
    scrubbing_paused: {
      on: {
        STOP_SCRUBBING: "paused",
      },
    },
  },
});

const Player = ({ book }) => {
  const [bookState, setBookState] = useState(book);
  const [isFullPlayer, setIsFullPlayer] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const [current, send] = useMachine(playerMachine, {
    services: {
      loadAudio: () => {
        return new Promise((resolve) => {
          AudioPlayer.setBook(book, {
            onLoad: resolve,
          });
        });
      },
    },
    actions: {
      pauseAudio: () => {
        AudioPlayer.pause();
      },
      playAudio: () => {
        AudioPlayer.play();
      },
      previous: () => {
        AudioPlayer.skip(-10);
      },
      forward: () => {
        AudioPlayer.skip(10);
      },
    },
  });

  let setProgress = useRef();

  useEffect(() => {
    setBookState(book);
  }, [book]);

  useEffect(() => {
    if (current.matches("playing")) {
      setProgress.current = setInterval(() => {
        if (current.matches("playing")) {
          const elapsed = AudioPlayer.getCurrentPosition();
          const percentage = elapsed / AudioPlayer.getDuration();
          setProgressPercentage(percentage);
        }
      }, 1000);
    } else clearInterval(setProgress.current);
    return () => {
      clearInterval(setProgress.current);
    };
  }, [current.value]);

  const playerClassnames = `player ${isFullPlayer ? "-full" : "-mini"} ${
    current.matches("playing") ? "-playing" : ""
  } ${current.matches("loading") ? "-loading" : ""}`;

  return bookState ? (
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
          {isFullPlayer && (
            <Scrubber
              percentage={progressPercentage}
              onScrubStarted={() => {
                send("SCRUB");
              }}
              onScrubEnded={(percentage) => {
                // Set audio seek to new position
                const duration = AudioPlayer.getDuration();
                AudioPlayer.seek(percentage * duration);
                setProgressPercentage(percentage);
                send("STOP_SCRUBBING");
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
                send("PREVIOUS");
              }}
            >
              <RewindIcon />
            </div>
            <div
              className="playerControlsPlayPause"
              onClick={(e) => {
                e.stopPropagation();
                send("PLAY_PAUSE");
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
                send("FORWARD");
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
