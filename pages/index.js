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

  return (
    <Layout>
      {featuredAudiobooks.length && (
        <AudioPlayerContext.Provider value={useAudioPlayer()}>
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
