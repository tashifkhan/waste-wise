import { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import CharacterCard from "./LandCard"; // Make sure the path is correct

function InfiniteLandingPage() {
	const [characters, setCharacters] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = async () => {
		if (page > totalPages) {
			setHasMore(false);
			return;
		}

		// Waiting for 1 second before fetching data to show loading spinner
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const res = await axios.get(
			`https://rickandmortyapi.com/api/character?page=${page}`
		);
		setCharacters((prevCharacters) => [...prevCharacters, ...res.data.results]);
		setTotalPages(res.data.info.pages);
		setPage((prevPage) => prevPage + 1);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="w-[1080px] mx-auto">
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					// width: "90%",
					minHeight: "100vh", // Ensure it takes full height of the viewport
					padding: "20px",
				}}
			>
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
					<div className="character-grid">
						{characters.map((character, index) => (
							<CharacterCard key={index} character={character} />
						))}
					</div>
				</InfiniteScroll>
			</div>
		</div>
	);
}

export default InfiniteLandingPage;
