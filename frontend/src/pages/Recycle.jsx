import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineReload } from "react-icons/ai";
import { FaYoutube } from "react-icons/fa";
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const Recycle = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Retrieve the passed state from the previous page
	const { recyclingMethod, tips, diySolutions, youtubeVideos } =
		location.state || {};

	const handleBackToHome = () => {
		navigate("/");
	};

	const handleVideoClick = (videoUrl) => {
		window.open(videoUrl, "_blank");
	};

	return (
		<div className="relative flex flex-col justify-center items-center min-h-screen w-full">
			{/* Video Background */}
			<video
				autoPlay
				muted
				loop
				className="absolute inset-0 w-full h-full object-cover"
				src={LandingPageVid2}
				type="video/mp4"
			/>

			{/* Overlay Content */}
			<div className="relative flex flex-col justify-start items-center w-full min-h-screen bg-black bg-opacity-50 p-4 md:p-8">
				{/* Header */}
				<div className="w-full flex justify-between items-center mb-8">
					<button
						onClick={handleBackToHome}
						className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition duration-300"
					>
						<AiOutlineArrowLeft size={20} />
						<span>Back to Home</span>
					</button>
					<h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
						<AiOutlineReload size={36} className="mr-3" />
						Recycling Guide
					</h1>
					<div className="w-32"></div> {/* Spacer for centering */}
				</div>

				{/* Main Content */}
				<div className="w-full max-w-6xl mx-auto space-y-8">
					{/* Recycling Methods Section */}
					<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg">
						<h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 flex items-center">
							<AiOutlineReload size={28} className="mr-3" />
							Recycling Methods
						</h2>
						{recyclingMethod && recyclingMethod.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{recyclingMethod.map((method, index) => (
									<div
										key={index}
										className="bg-green-50 border border-green-200 p-4 rounded-lg hover:shadow-md transition duration-300"
									>
										<h3 className="font-semibold text-green-900 text-lg mb-2">
											Method {index + 1}
										</h3>
										<p className="text-green-800">{method}</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-600 text-lg">
								No recycling methods available.
							</p>
						)}
					</div>

					{/* Tips and DIY Solutions Grid */}
					<div className="grid gap-8 lg:grid-cols-2">
						{/* Tips Section */}
						<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg">
							<h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
								💡 Recycling Tips
							</h2>
							{tips && tips.length > 0 ? (
								<div className="space-y-4">
									{tips.map((tip, index) => (
										<div
											key={index}
											className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
										>
											<div className="flex items-start">
												<span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
													{index + 1}
												</span>
												<p className="text-blue-900 leading-relaxed">{tip}</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-600 text-lg">No tips available.</p>
							)}
						</div>

						{/* DIY Solutions Section */}
						<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg">
							<h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6">
								🛠️ DIY Solutions
							</h2>
							{diySolutions && diySolutions.length > 0 ? (
								<div className="space-y-4">
									{diySolutions.map((solution, index) => (
										<div
											key={index}
											className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg"
										>
											<div className="flex items-start">
												<span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
													{index + 1}
												</span>
												<p className="text-purple-900 leading-relaxed">
													{solution}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-600 text-lg">
									No DIY solutions available.
								</p>
							)}
						</div>
					</div>

					{/* YouTube Videos Section */}
					{youtubeVideos && youtubeVideos.length > 0 && (
						<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg">
							<h2 className="text-2xl md:text-3xl font-bold text-red-800 mb-6 flex items-center">
								<FaYoutube size={32} className="mr-3 text-red-600" />
								DIY Video Tutorials
							</h2>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{youtubeVideos.slice(0, 8).map((videoUrl, index) => {
									const videoId = videoUrl.split("v=")[1];
									const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

									return (
										<div
											key={index}
											className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
											onClick={() => handleVideoClick(videoUrl)}
										>
											<div className="relative">
												<img
													src={thumbnailUrl}
													alt={`DIY Tutorial ${index + 1}`}
													className="w-full h-32 object-cover"
												/>
												<div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
													<FaYoutube
														size={40}
														className="text-white opacity-80"
													/>
												</div>
											</div>
											<div className="p-3">
												<p className="text-sm text-gray-700 font-medium">
													DIY Tutorial {index + 1}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Click to watch on YouTube
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Call to Action */}
					<div className="text-center">
						<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								🌱 Start Your Recycling Journey
							</h3>
							<p className="text-gray-700 mb-6">
								Transform waste into wonderful! Every recycled item contributes
								to a healthier planet and a sustainable future.
							</p>
							<button
								onClick={handleBackToHome}
								className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition duration-300 font-semibold"
							>
								Recycle Another Item
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Recycle;
