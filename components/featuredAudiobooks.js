import AudiobookListItem from "./audioBookListItem";

const FeaturedAudiobooks = ({ featuredAudiobooks, onSelect = () => {} }) => {
  return (
    <div className="mainContentIsLoaded">
      <h2 className="mainContentListTitle">Featured Audiobooks</h2>
      <ul className="list unstyled">
        {featuredAudiobooks.map(book => (
          <AudiobookListItem key={book.id} book={book} />
        ))}
      </ul>
    </div>
  );
};

export default FeaturedAudiobooks;
