import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineReload, AiOutlineDelete } from "react-icons/ai"; // React Icons for Recycle and Dispose
import { Circles } from "react-loader-spinner"; // Spinner
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const Banner = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Retrieve the passed state from the previous page (name, type, and desc)
	const { name, type, desc } = location.state || {};

	const [recycleData, setRecycleData] = useState(null);
	const [disposalData, setDisposalData] = useState(null);
	const [youtubeVideos, setYoutubeVideos] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!name || !type) {
			setError("Missing necessary information for the request.");
		}
	}, [name, type]);

	const handleRecycle = async () => {
		setLoading(true); // Start loading state

		try {
			// First API Call: Generate Recycling Methods
			const recycleResponse = await axios.post(
				"http://localhost:5000/generate_recycle",
				{
					name: name,
					type: type,
					desc: desc || "No description provided",
				}
			);

			setRecycleData(recycleResponse.data); // Set recycling data
			setError(recycleResponse.data.error || ""); // Handle any errors from the response

			// Second API Call: Fetch YouTube videos
			const youtubeResponse = await axios.post(
				"http://localhost:5000/youtube_search",
				{
					name_item: name, // Use waste name to search for DIY videos
				}
			);

			if (youtubeResponse.data.error === "none") {
				setYoutubeVideos(youtubeResponse.data.video_links); // Set YouTube video links
			} else {
				setError("Error fetching YouTube videos.");
			}

			// If both APIs succeed, navigate to the /recycle page with all the data
			if (
				!recycleResponse.data.error &&
				youtubeResponse.data.error === "none"
			) {
				navigate("/recycle", {
					state: {
						recyclingMethod: recycleResponse.data.recycling_method,
						tips: recycleResponse.data.tips,
						diySolutions: recycleResponse.data.diy_solutions,
						youtubeVideos: youtubeResponse.data.video_links, // Pass YouTube videos to the new page
					},
				});
			}
		} catch (error) {
			console.error(error);
			setError("Failed to process recycling or fetch YouTube videos."); // Handle request errors
		} finally {
			setLoading(false); // End loading state
		}
	};

	const handleDispose = async () => {
		setLoading(true); // Start loading state

		try {
			// API Call: Generate Disposal Methods
			const disposalResponse = await axios.post(
				"http://localhost:5000/generate_disposal",
				{
					name: name,
					type: type,
					desc: desc || "No description provided",
				}
			);

			setDisposalData(disposalResponse.data); // Set disposal data
			setError(disposalResponse.data.error || ""); // Handle any errors from the response

			// If API succeeds, navigate to the /disposal page with the data
			if (disposalResponse.data.error === "none") {
				navigate("/disposal", {
					state: {
						disposalMethods: disposalResponse.data.disposal_method,
						tips: disposalResponse.data.tips,
						wasteName: name,
						wasteType: type,
					},
				});
			}
		} catch (error) {
			console.error(error);
			setError("Failed to process disposal methods."); // Handle request errors
		} finally {
			setLoading(false); // End loading state
		}
	};

	return (
		<div className="relative flex flex-col justify-center items-center min-h-screen w-full">
			{/* Video Background */}
			<video
				autoPlay
				muted
				loop
				className="absolute inset-0 w-full h-full object-cover"
				src={LandingPageVid2} // Make sure to add your video source here
				type="video/mp4"
			/>

			{/* Overlay Content */}
			<div className="relative flex flex-col justify-center items-center w-full min-h-screen bg-black bg-opacity-50 p-4 md:p-8">
				{/* Top Section: Waste Information */}
				<div className="bg-white bg-opacity-50 backdrop-blur-lg p-4 md:p-8 rounded-lg shadow-lg text-center w-full md:w-1/2 h-1/2 flex flex-col justify-center items-center">
					<p className="text-xl md:text-2xl font-semibold text-gray-800">
						WASTE
					</p>
					<p className="text-2xl md:text-4xl font-bold text-blue-800 mb-2 md:mb-4">
						{name || "Loading..."}
					</p>
					<p className="text-xl md:text-2xl font-semibold text-gray-800">
						TYPE
					</p>
					<p className="text-2xl md:text-4xl font-bold text-blue-800 mb-4 md:mb-6">
						{type || "Loading..."}
					</p>
				</div>

				{/* Button Section */}
				<div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-8">
					<button
						className="flex items-center space-x-2 bg-green-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-md hover:bg-green-700 transition duration-300"
						onClick={handleRecycle}
					>
						<AiOutlineReload size={24} />{" "}
						<span className="text-lg md:text-xl">RECYCLE</span>
					</button>
					<button
						className="flex items-center space-x-2 bg-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-md hover:bg-red-700 transition duration-300"
						onClick={handleDispose}
					>
						<AiOutlineDelete size={24} />{" "}
						<span className="text-lg md:text-xl">DISPOSE</span>
					</button>
				</div>

				{/* Loading and Error Display */}
				{loading && (
					<div className="flex items-center justify-center mt-6">
						<Circles color="white" height={80} width={80} />
					</div>
				)}
				{error && <p className="text-red-500 text-center mt-4">{error}</p>}
			</div>
		</div>
	);
};

export default Banner;
