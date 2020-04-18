import React, { useEffect, useContext } from "react";
import LoadingIcon from "../public/icons/loading.svg";
import PlayIcon from "../public/icons/play.svg";
import PauseIcon from "../public/icons/pause.svg";
import { AudioPlayerContext } from "../pages";

const AudioBookListItem = ({ book, onBookSelected = () => {} }) => {
  const [currentBook, stateMachine, exposedPlayer] = useContext(
    AudioPlayerContext
  );
  let className = "";
  if (currentBook && currentBook.id === book.id)
    className = `${stateMachine.matches("loading") ? "-loading" : ""} ${
      stateMachine.matches("playing") ? "-playing" : ""
    }`;
  useEffect(() => {
    const progress = JSON.parse(localStorage.getItem("progress"));
    if (progress && progress.book && progress.book.id === book.id) {
      exposedPlayer.setBook(
        book,
        {},
        progress.trackIndex,
        progress.elapsedTime
      );
    }
  }, []);

  return (
    <li className={`listItem ` + className}>
      <button
        type="button"
        onClick={() => {
          onBookSelected(book);
          if (!currentBook || (currentBook && currentBook.id !== book.id))
            exposedPlayer.setBook(book);
          exposedPlayer.sendEvent("PLAY_PAUSE");
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
