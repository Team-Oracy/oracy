/* global require */
import React, { useState } from "react";
import "../styles/app.sass";
import FeaturedAudiobooks from "../components/featuredAudiobooks";
import ErrorState from "../components/errorState";
import Layout from "../components/layout";
import Player from "../components/player/player";
import useAudioPlayer from "../utils/useAudioPlayer";
const { featuredAudiobooks } = require("./cachedData");

export const AudioPlayerContext = React.createContext();

const Home = () => {
  const [book, setBook] = useState(null);
  let progress = {};
  if (typeof localStorage !== "undefined") {
    progress = JSON.parse(localStorage.getItem("progress"));
  }

  const audioplayer = useAudioPlayer(
    progress.book || undefined,
    progress.trackIndex || 0,
    progress.elapsedTime || 0
  );

  return (
    <Layout>
      {featuredAudiobooks.length && (
        <AudioPlayerContext.Provider value={audioplayer}>
          <FeaturedAudiobooks
            featuredAudiobooks={featuredAudiobooks}
            onBookSelected={setBook}
          />
          <Player book={book} />
        </AudioPlayerContext.Provider>
      )}
      {!featuredAudiobooks.length && <ErrorState />}
    </Layout>
  );
};

export default Home;
