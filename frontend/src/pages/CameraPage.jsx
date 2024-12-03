import React from "react";
import CameraAndGallery from "../components/CameraAndGallery"; // Ensure this path is correct
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const CameraPage = () => {
	return (
		<div className="relative h-screen overflow-hidden flex items-center justify-center bg-black">
			{/* Video Background */}
			<video
				autoPlay
				loop
				muted
				className="absolute top-0 left-0 w-full h-full object-cover"
			>
				<source src={LandingPageVid2} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			{/* Content */}
			<div className="relative z-10 w-3/4 h-5/6 flex flex-col items-center justify-center p-5 bg-white bg-opacity-10 rounded-2xl border border-white border-opacity-20 shadow-lg overflow-hidden">
				<CameraAndGallery />
			</div>
		</div>
	);
};

export default CameraPage;
