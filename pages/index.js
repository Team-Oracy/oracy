/* global require */
import React from "react";
import FeaturedAudiobooks from "../components/featuredAudiobooks";
import ErrorState from "../components/errorState";
import Layout from "../components/layout";
import Player from "../components/player/player";
import useAudioPlayer from "../utils/useAudioPlayer";
const { featuredAudiobooks } = require("./cachedData");

export const AudioPlayerContext = React.createContext();

const Home = () => {
  let progress = {};
  if (typeof localStorage !== "undefined") {
    progress = JSON.parse(localStorage.getItem("progress")) || {};
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
          <FeaturedAudiobooks featuredAudiobooks={featuredAudiobooks} />
          <Player
            initialProgressPercentage={progress.progressPercentage || 0}
          />
        </AudioPlayerContext.Provider>
      )}
      {!featuredAudiobooks.length && <ErrorState />}
    </Layout>
  );
};

export default Home;
