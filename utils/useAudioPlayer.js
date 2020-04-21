import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import AudioPlayer from "../utils/audioPlayer";
import { useState } from "react";

const playerMachine = Machine({
  id: "audioPlayer",
  initial: "idle",
  context: {
    currentBook: undefined,
  },
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
        PLAY_PAUSE: [
          {
            target: "paused",
            cond: (ctx, event) =>
              ctx.currentBook && event.data.id === ctx.currentBook.id,
          },
          {
            target: "loading",
          },
        ],
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
        PLAY_PAUSE: [
          {
            target: "playing",
            cond: (ctx, event) =>
              ctx.currentBook && event.data.id === ctx.currentBook.id,
          },
          {
            target: "loading",
          },
        ],
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

function useAudioPlayer(
  initialBook = {},
  initialTrackIndex,
  initialElapsedTime
) {
  const [currentBook, setCurrentBook] = useState(initialBook);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [current, send] = useMachine(playerMachine, {
    services: {
      loadAudio: (ctx, event) => {
        return new Promise((resolve) => {
          if (
            !isInitialLoad &&
            (!event.data || (currentBook && event.data.id === currentBook.id))
          )
            resolve();
          ctx.currentBook = event.data;
          setCurrentBook(event.data);
          AudioPlayer.setBook(
            event.data,
            {
              onLoad: resolve,
            },
            isInitialLoad && event.data.id === initialBook.id
              ? initialTrackIndex
              : 0,
            isInitialLoad && event.data.id === initialBook.id
              ? initialElapsedTime
              : 0
          );
          setIsInitialLoad(false);
        });
      },
    },
    actions: {
      pauseAudio: () => {
        AudioPlayer.pause();
      },
      playAudio: (_, event) => {
        if (
          current.historyValue &&
          current.historyValue.current === "scrubbing_played"
        ) {
          const duration = AudioPlayer.getDuration();
          AudioPlayer.seek(event.data * duration);
        }
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
    getProgress() {
      return AudioPlayer.getProgress();
    },
    sendEvent(event, arg = currentBook) {
      send({ type: event, data: arg });
    },
    setBook: (book) => {
      setCurrentBook(book);
    },
  };

  return [currentBook, current, exposedPlayer];
}

export default useAudioPlayer;
