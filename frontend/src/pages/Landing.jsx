import React from "react";
import { useNavigate } from "react-router-dom";
import InfiniteLandingPage from "../components/InfiniteLandingPage";
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const Landing = () => {
	const navigate = useNavigate();

	const handleAddImageClick = () => {
		navigate("/CameraPage");
	};

	return (
		<div className="relative h-screen overflow-hidden">
			{/* Video Background */}
			<video
				className="absolute top-0 left-0 w-full h-full object-cover"
				autoPlay
				loop
				muted
			>
				<source src={LandingPageVid2} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Overlay to darken the video */}
			<div className="absolute inset-0 bg-black bg-opacity-50"></div>

			{/* Main Content */}
			<div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
				{/* Big Heading */}
				<h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
					Our Heroes
				</h1>

				{/* Leaderboard Component with scrolling/overflow */}
				<div className="w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-auto mb-4">
					<InfiniteLandingPage />
				</div>

				{/* Green Add Button */}
				<button
					className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600"
					onClick={handleAddImageClick}
				>
					Add Image of your waste
				</button>
			</div>
		</div>
	);
};

export default Landing;
