import LoadingIcon from "../public/icons/loading.svg";
import PlayIcon from "../public/icons/play.svg";
import PauseIcon from "../public/icons/pause.svg";
import AudioPlayer from "../utils/audioPlayer";
import { useState, useEffect } from "react";

const AudioBookListItem = ({
  book,
  onPlayStateChange = () => {},
  onLoadingStateChange = () => {}
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const className = `listItem ${isLoading ? "-loading" : ""} ${
    isPlaying ? "-playing" : ""
  }`;
  useEffect(() => {
    AudioPlayer.onBookStopped(book.id, () => {
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
      onPlayStateChange(false);
    });

    AudioPlayer.onAudioStarted(book.id, () => {
      onPlayStateChange(book, true);
      setIsPlaying(true);
    });

    AudioPlayer.onAudioPaused(book.id, () => {
      onPlayStateChange(book, false);
      setIsPlaying(false);
    });

    const progress = JSON.parse(localStorage.getItem("progress"));
    if (progress && progress.book && progress.book.id === book.id) {
      onLoadingStateChange(book, false);
      setIsPlaying(false);
      setIsPaused(true);
      AudioPlayer.setBook(book, {}, progress.trackIndex);
    }
  }, []);
  return (
    <li className={className}>
      <button
        type="button"
        onClick={() => {
          if (isPlaying) {
            AudioPlayer.pause();
            setIsPlaying(false);
            setIsPaused(true);
            return;
          }

          if (isPaused) {
            setIsPlaying(true);
            setIsPaused(false);
            AudioPlayer.resume();
            return;
          }

          setIsLoading(true);
          onLoadingStateChange(book, true);
          AudioPlayer.setBook(book, {
            onLoad: () => {
              onLoadingStateChange(book, false);
              setIsLoading(false);
              setIsPlaying(true);
            }
          });
          AudioPlayer.play();
        }}
        className="listItemImage unstyled"
      >
        <img src={book.coverImageSrc} alt="" />
        <div className="listItemImageControls">
          <div className="listItemImageControlsLoading" title="Loading">
            <LoadingIcon />
          </div>
          <div className="listItemImageControlsPlay" title="Play">
            <PlayIcon />
          </div>
          <div className="listItemImageControlsPause" title="Pause">
            <PauseIcon />
          </div>
        </div>
      </button>
      <div className="listItemContent">
        <h6 className="listItemTitle">{book.title}</h6>
        <div className="listItemAuthor">By {book.author}</div>
        <p className="listItemTeaser">{book.description}...</p>
      </div>
    </li>
  );
};

export default AudioBookListItem;
