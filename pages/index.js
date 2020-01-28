import React, { useRef, useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";
import "../styles/app.sass";
import FeaturedAudiobooks from "../components/featuredAudiobooks";
import ErrorState from "../components/errorState";
import Layout from "../components/layout";
import Player from "../components/player";
import AudioPlayer from "../utils/audioPlayer";
import Loading from "../public/icons/loading.svg";

const featuredAudiobookIds = [
  "art_of_war_librivox",
  "beyond_good_and_evil_librivox",
  "divine_comedy_librivox",
  "don_quixote_vol1_librivox",
  "eves_diary_librivox",
  "fanny_hill_librivox",
  "harvester_solo_librivox",
  "iliad_popetranslation_1506_librivox",
  "invisible_man_librivox",
  "man_who_knew_librivox",
  "meditations_0708_librivox",
  "moby_dick_librivox",
  "mysterious_island_ms_librivox",
  "myths_legends_0805_librivox",
  "odyssey_butler_librivox",
  "pride_and_prejudice_librivox",
  "prince_pa_librivox",
  "sea_wolf_0907_librivox",
  "tale_two_cities_librivox",
  "the_paradise_mystery_librivox",
  "thoughts_on_art_and_life_1702_librivox",
  "treasure_island_ap_librivox",
  "typee_librivox",
  "typhoon_conrad_librivox",
  "war_worlds_solo_librivox",
  "war_and_peace_01_librivox",
  "waste_land_librivox"
];

function fetchTracks(audiobook) {
  let tracks = [];
  audiobook.files.forEach(function(file) {
    if (file.track) {
      tracks.push("https://" + audiobook.d1 + audiobook.dir + "/" + file.name);
    }
  });
  return tracks;
}

const Home = () => {
  const [featuredAudiobooks, setFeaturedAudiobooks] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [book, setBook] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    async function fetchBooks() {
      let featuredAudiobooks = [];
      const cachedBooks = localStorage.getItem("books");
      if (cachedBooks) {
        featuredAudiobooks = JSON.parse(cachedBooks);
      } else {
        const promises = featuredAudiobookIds.map(async featuredAudiobookId => {
          const response = await fetch(
            `https://archive.org/metadata/${featuredAudiobookId}`
          ).then(r => r.json());

          const cleanedUpDescription = response.metadata.description.replace(
            /<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g,
            ""
          );
          const audiobook = {
            id: featuredAudiobookId,
            title: response.metadata.title,
            description: cleanedUpDescription.substr(0, 256),
            author: response.metadata.creator,
            coverImageSrc:
              "https://" +
              response.d1 +
              response.dir +
              "/" +
              response.files[
                response.files.findIndex(file => file.format === "JPEG")
              ].name,
            audioTracks: fetchTracks(response)
          };
          featuredAudiobooks.push(audiobook);
        });
        await Promise.all(promises);
        localStorage.setItem("books", JSON.stringify(featuredAudiobooks));
      }
      setFeaturedAudiobooks(featuredAudiobooks);
      setLoaded(true);
    }

    fetchBooks();
  }, []);

  return (
    <Layout>
      {!loaded && <Loading className="listLoading" />}
      {loaded && featuredAudiobooks.length && (
        <>
          <FeaturedAudiobooks
            featuredAudiobooks={featuredAudiobooks}
            onPlayStateChange={(selectedBook, isPlaying) => {
              setIsAudioPlaying(isPlaying);
              setBook(selectedBook);
            }}
          />
          <Player book={book} isPlaying={isAudioPlaying} />
        </>
      )}
      {loaded && !featuredAudiobooks.length && <ErrorState />}
    </Layout>
  );
};

export default Home;
