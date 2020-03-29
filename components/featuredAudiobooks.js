import AudioBookListItem from "./audioBookListItem";

const FeaturedAudiobooks = ({
  featuredAudiobooks,
  onPlayStateChange = () => {},
  onLoadingStateChange = () => {},
}) => {
  return (
    <div className="mainContentIsLoaded">
      <h2 className="mainContentListTitle">Featured Audiobooks</h2>
      <ul className="list unstyled">
        {featuredAudiobooks.map((book) => (
          <AudioBookListItem
            key={book.id}
            book={book}
            onPlayStateChange={onPlayStateChange}
            onLoadingStateChange={onLoadingStateChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default FeaturedAudiobooks;
