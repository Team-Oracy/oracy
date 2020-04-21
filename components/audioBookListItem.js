import React, { useEffect, useContext } from "react";
import LoadingIcon from "../public/icons/loading.svg";
import PlayIcon from "../public/icons/play.svg";
import PauseIcon from "../public/icons/pause.svg";
import { AudioPlayerContext } from "../pages";

const AudioBookListItem = ({ book }) => {
  const [currentBook, stateMachine, exposedPlayer] = useContext(
    AudioPlayerContext
  );
  let className = "";
  if (currentBook && currentBook.id === book.id)
    className = `${stateMachine.matches("loading") ? "-loading" : ""} ${
      stateMachine.matches("playing") ? "-playing" : ""
    }`;

  return (
    <li className={`listItem ` + className}>
      <button
        type="button"
        onClick={() => {
          exposedPlayer.sendEvent("PLAY_PAUSE", book);
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
