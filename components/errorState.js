const ErrorState = () => (
  <div className="mainContentIsError">
    <div className="mainContentError">
      Error loading audiobooks.
      <button
        id="retryLoadingAudiobooks"
        type="button"
        className="btn btn-outline-primary"
      >
        Try again
      </button>
    </div>
  </div>
);

export default ErrorState;
