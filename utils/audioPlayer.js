import { Howl } from "howler";

let howler;
let audioTracks = [];
let currentTrackIndex = 0;

class AudioPlayer {
  play(elapsedTime) {
    if (elapsedTime) howler.seek(elapsedTime);
    howler.play();
  }

  setBook(book, events = {}, trackIndex = 0, elapsedTime = 0) {
    audioTracks = book.audioTracks;
    if (howler) {
      howler.stop();
      howler.unload();
    }
    this._createHowlerObject(book, events, trackIndex);
    howler.seek(elapsedTime);
  }
  _saveProgress(book, trackIndex) {
    const progress = this.getProgress();
    if (book && typeof progress.elapsedTime !== "object")
      localStorage.setItem(
        "progress",
        JSON.stringify({
          book,
          trackIndex,
          elapsedTime: progress.elapsedTime,
          progressPercentage: progress.progressPercentage,
        })
      );
  }

  _createHowlerObject(book, events, trackIndex) {
    currentTrackIndex = trackIndex;
    let progressInterval;
    if (howler) howler.unload();
    howler = new Howl({
      html5: true,
      autoUnlock: true,
      src: audioTracks[trackIndex],
      onplay: () => {
        progressInterval = setInterval(
          () => this._saveProgress(book, trackIndex),
          1000
        );
      },
      onpause: () => {
        clearInterval(progressInterval);
      },
      onload: () => {
        if (events.onLoad) events.onLoad();
      },
      onseek: () => this._saveProgress(book, trackIndex),
      onstop: () => {
        clearInterval(progressInterval);
      },
      onend: () => {
        clearInterval(progressInterval);
        if (trackIndex < audioTracks.length - 1) {
          this._createHowlerObject(book, events, trackIndex + 1);
          this.play();
        }
      },
    });
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

  getCurrentPosition() {
    return howler.seek();
  }

  seek(position) {
    return howler.seek(position);
  }

  getDuration() {
    return howler.duration();
  }

  getProgress() {
    const duration = this.getDuration();
    let elapsedTime = this.getCurrentPosition();
    if (isNaN(elapsedTime)) elapsedTime = 0;
    const progressPercentage = elapsedTime / duration;
    return {
      trackIndex: currentTrackIndex,
      elapsedTime,
      progressPercentage,
      duration,
    };
  }
}

export default new AudioPlayer();
