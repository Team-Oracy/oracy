import React from "react";
import AudioBookListItem from "./audioBookListItem";

const FeaturedAudiobooks = ({ featuredAudiobooks }) => {
  return (
    <div className="mainContentIsLoaded">
      <h2 className="mainContentListTitle">Featured Audiobooks</h2>
      <ul className="list unstyled">
        {featuredAudiobooks.map((book) => (
          <AudioBookListItem key={book.id} book={book} />
        ))}
      </ul>
    </div>
  );
};

export default FeaturedAudiobooks;
