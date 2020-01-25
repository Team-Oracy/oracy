import LoadingIcon from "../public/icons/loading.svg";
import PlayIcon from "../public/icons/play.svg";
import PauseIcon from "../public/icons/pause.svg";
import AudioPlayer from "../utils/audioPlayer";
import { useState, useEffect } from "react";

const AudiobookListItem = ({ book }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const className = `listItem ${isLoading ? "-loading" : ""} ${
    isPlaying ? "-playing" : ""
  }`;
  useEffect(() => {
    AudioPlayer.otherBookSelected(book.id, () => {
      setIsPlaying(false);
      setIsPaused(false);
    });
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
          AudioPlayer.play(book, {
            onLoad: () => {
              setIsLoading(false);
              setIsPlaying(true);
            }
          });
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

export default AudiobookListItem;
