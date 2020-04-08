/* global require */
import React, { useState } from "react";
import "../styles/app.sass";
import FeaturedAudiobooks from "../components/featuredAudiobooks";
import ErrorState from "../components/errorState";
import Layout from "../components/layout";
import Player from "../components/player/player";
const { featuredAudiobooks } = require("./cachedData");

const Home = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [book, setBook] = useState(null);
  const [isAudioLoading, SetIsAudioLoading] = useState(false);

  return (
    <Layout>
      {featuredAudiobooks.length && (
        <>
          <FeaturedAudiobooks
            featuredAudiobooks={featuredAudiobooks}
            onPlayStateChange={(_, isPlaying) => {
              setIsAudioPlaying(isPlaying);
            }}
            onLoadingStateChange={(selectedBook, isLoading) => {
              setBook(selectedBook);
              SetIsAudioLoading(isLoading);
            }}
          />
          <Player
            book={book}
            isPlaying={isAudioPlaying}
            isAudioLoading={isAudioLoading}
          />
        </>
      )}
      {!featuredAudiobooks.length && <ErrorState />}
    </Layout>
  );
};

export default Home;
