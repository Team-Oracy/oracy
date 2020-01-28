import AudiobookListItem from "./audioBookListItem";

const FeaturedAudiobooks = ({
  featuredAudiobooks,
  onPlayStateChange = () => {}
}) => {
  return (
    <div className="mainContentIsLoaded">
      <h2 className="mainContentListTitle">Featured Audiobooks</h2>
      <ul className="list unstyled">
        {featuredAudiobooks.map(book => (
          <AudiobookListItem
            key={book.id}
            book={book}
            onPlayStateChange={onPlayStateChange}
          />
        ))}
      </ul>
    </div>
  );
};

export default FeaturedAudiobooks;
