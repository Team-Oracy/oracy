import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import AudioPlayer from "../utils/audioPlayer";
import { useState } from "react";

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
        onDone: { target: "playing" },
      },
    },
    playing: {
      entry: "playAudio",
      on: {
        CHANGE_BOOK: "idle",
        PLAY_PAUSE: "paused",
        SCRUB: "scrubbing_played",
        PREVIOUS: { target: "playing", actions: ["previous"] },
        FORWARD: { target: "playing", actions: ["forward"] },
      },
    },
    paused: {
      entry: "pauseAudio",
      on: {
        CHANGE_BOOK: "idle",
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

function useAudioPlayer() {
  const [currentBook, setCurrentBook] = useState();
  const [current, send] = useMachine(playerMachine, {
    services: {
      loadAudio: () => {
        return new Promise((resolve) => {
          AudioPlayer.setBook(currentBook, {
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
        if (current.historyValue.current === "scrubbing_played") return;
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

  const exposedPlayer = {
    getProgressPercentage() {
      const elapsed = AudioPlayer.getCurrentPosition();
      return elapsed / AudioPlayer.getDuration();
    },
    sendEvent(event, arg) {
      if (event === "STOP_SCRUBBING") {
        const duration = AudioPlayer.getDuration();
        AudioPlayer.seek(arg * duration);
      }
      send(event);
    },
    setBook: (book, events, trackIndex, elapsedTime) => {
      setCurrentBook(book);
      send("CHANGE_BOOK");
      // AudioPlayer.setBook(book, events, trackIndex, elapsedTime);
    },
  };

  return [currentBook, current, exposedPlayer];
}

export default useAudioPlayer;
