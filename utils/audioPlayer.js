import { Howl } from "howler";

let howler;
let subscribersStopped = [];
let subscribersStarted = [];
let subscribersPaused = [];
let audioTracks = [];
let somethingIsPlayingCb = () => {};
let somethingPausedCb = () => {};

class AudioPlayer {
  play(book, events = {}, trackIndex = 0) {
    audioTracks = book.audioTracks;
    if (howler) {
      howler.stop();
      howler.unload();
      subscribersStopped
        .filter(s => s.id !== book.id)
        .forEach(s => s.callback());
    }

    this._createHowlerObject(book, events, trackIndex);
  }

  _createHowlerObject(book, events, trackIndex) {
    let progressInterval;
    howler = new Howl({
      html5: true,
      src: audioTracks[trackIndex],
      onplay: () => {
        progressInterval = setInterval(() => {
          localStorage.setItem(
            "progress",
            JSON.stringify({
              book,
              trackIndex,
              elapsedTime: this.getCurrentPosition()
            })
          );
        }, 1000);
        subscribersStarted
          .filter(s => s.id === book.id)
          .forEach(s => s.callback(trackIndex));
      },
      onpause: () => {
        clearInterval(progressInterval);
        subscribersPaused
          .filter(s => s.id === book.id)
          .forEach(s => s.callback());
      },
      onload: () => {
        if (events.onLoad) events.onLoad();
        const nextTrack = audioTracks[trackIndex + 1];
        if (nextTrack)
          //preload the next audio track
          new Howl({
            src: nextTrack
          });
      },
      onend: () => {
        clearInterval(progressInterval);
        if (trackIndex < audioTracks.length - 1) {
          this._createHowlerObject(book, events, trackIndex + 1);
        }
      }
    });
    howler.play();
  }

  pause() {
    howler.pause();
  }

  resume() {
    howler.play();
  }

  skip(numOfSeconds) {
    const skipTo = howler.seek() + numOfSeconds;
    if (skipTo < 0) howler.seek(0);
    else howler.seek(skipTo);
  }

  onBookStopped(id, cb) {
    subscribersStopped.push({ id, callback: cb });
  }

  onAudioStarted(id, cb) {
    subscribersStarted.push({ id, callback: cb });
  }

  onAudioPaused(id, cb) {
    subscribersPaused.push({ id, callback: cb });
  }

  getCurrentPosition() {
    return howler.seek();
  }

  seek(position) {
    return howler.seek(position);
  }

  getDuration() {
    return howler.duration();
  }
}

export default new AudioPlayer();
