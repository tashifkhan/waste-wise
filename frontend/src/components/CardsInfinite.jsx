import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import InfiniteScroll from "react-infinite-scroll-component";
import CharacterCard from "./Card";

function CardsInfinite() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    if (page == totalPages + 1) {
      setHasMore(false);
      return;
    }

    // <----------------------------------------------->

    // waiting for 1 second before fetching data to show loading spinner, you can skip this
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // <----------------------------------------------->

    const res = await axios.get(
      `https://rickandmortyapi.com/api/character?page=${page}`
    );
    setCharacters((prevPosts) => [...prevPosts, ...res.data.results]);
    setTotalPages(res.data.info.pages);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Rick and Morty characters!</h1>
      <InfiniteScroll
        dataLength={characters.length} 
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {/* Map over characters array and return JSX */}
        {characters.map((character, index) => (
          <CharacterCard key={index} character={character} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default CardsInfinite;