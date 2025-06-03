import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	AiOutlineArrowLeft,
	AiOutlineReload,
	AiOutlineLeft,
	AiOutlineRight,
	AiOutlineCheckCircle,
} from "react-icons/ai";
import { FaYoutube, FaRecycle, FaLeaf, FaTools } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const Recycle = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	// Retrieve the passed state from the previous page
	const { recyclingMethod, tips, diySolutions, youtubeVideos } =
		location.state || {};

	useEffect(() => {
		// Trigger entrance animation
		setIsVisible(true);
	}, []);

	const handleBackToHome = () => {
		navigate("/");
	};

	const handleVideoClick = (videoUrl) => {
		window.open(videoUrl, "_blank");
	};

	const nextVideo = () => {
		if (youtubeVideos && youtubeVideos.length > 0) {
			setCurrentVideoIndex((prev) =>
				prev === youtubeVideos.length - 1 ? 0 : prev + 1
			);
		}
	};

	const prevVideo = () => {
		if (youtubeVideos && youtubeVideos.length > 0) {
			setCurrentVideoIndex((prev) =>
				prev === 0 ? youtubeVideos.length - 1 : prev - 1
			);
		}
	};

	const getVisibleVideos = () => {
		if (!youtubeVideos || youtubeVideos.length === 0) return [];

		const videosToShow = 4; // Show 4 videos at a time
		const videos = [];

		for (let i = 0; i < videosToShow; i++) {
			const index = (currentVideoIndex + i) % youtubeVideos.length;
			videos.push({
				url: youtubeVideos[index],
				index: index,
			});
		}

		return videos;
	};

	return (
		<div className="relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden">
			{/* Video Background with modern overlay */}
			<video
				autoPlay
				muted
				loop
				className="absolute inset-0 w-full h-full object-cover scale-105"
				src={LandingPageVid2}
				type="video/mp4"
			/>

			{/* Modern gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-black/60 via-green-900/30 to-black/70" />

			{/* Content Container */}
			<div
				className={`relative flex flex-col justify-start items-center w-full min-h-screen p-4 md:p-8 transition-all duration-1000 ${
					isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
				}`}
			>
				{/* Modern Header */}
				<div className="w-full flex justify-between items-center mb-8 backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
					<button
						onClick={handleBackToHome}
						className="group flex items-center space-x-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20"
					>
						<AiOutlineArrowLeft
							size={20}
							className="group-hover:-translate-x-1 transition-transform duration-300"
						/>
						<span className="font-medium">Back to Home</span>
					</button>
					<div className="flex items-center space-x-3 text-white">
						<div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
							<FaRecycle size={32} />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
							Recycling Guide
						</h1>
					</div>
					<div className="w-32"></div> {/* Spacer for centering */}
				</div>

				{/* Main Content with modern cards */}
				<div className="w-full max-w-7xl mx-auto space-y-8">
					{/* Recycling Methods Section */}
					<div className="group backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
						<div className="flex items-center mb-8">
							<div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mr-4 shadow-lg">
								<FaRecycle size={32} className="text-white" />
							</div>
							<div>
								<h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
									Recycling Methods
								</h2>
								<p className="text-gray-600 dark:text-gray-300 mt-1">
									Transform waste into wonder
								</p>
							</div>
						</div>
						{recyclingMethod && recyclingMethod.length > 0 ? (
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{recyclingMethod.map((method, index) => (
									<div
										key={index}
										className="group/card relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border border-green-200 dark:border-green-700 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
									>
										<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full -translate-y-10 translate-x-10 group-hover/card:scale-150 transition-transform duration-500" />
										<div className="relative">
											<div className="flex items-center mb-4">
												<div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
													<span className="text-white font-bold text-sm">
														{index + 1}
													</span>
												</div>
												<h3 className="font-bold text-green-900 dark:text-green-100 text-lg">
													Method {index + 1}
												</h3>
											</div>
											<p className="text-green-800 dark:text-green-200 leading-relaxed">
												{method}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaRecycle size={24} className="text-gray-500" />
								</div>
								<p className="text-gray-600 dark:text-gray-400 text-lg">
									No recycling methods available.
								</p>
							</div>
						)}
					</div>

					{/* Tips and DIY Solutions Grid */}
					<div className="grid gap-8 lg:grid-cols-2">
						{/* Tips Section */}
						<div className="group backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
							<div className="flex items-center mb-8">
								<div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl mr-4 shadow-lg">
									<HiSparkles size={32} className="text-white" />
								</div>
								<div>
									<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent">
										Smart Tips
									</h2>
									<p className="text-gray-600 dark:text-gray-300 mt-1">
										Expert recycling advice
									</p>
								</div>
							</div>
							{tips && tips.length > 0 ? (
								<div className="space-y-4">
									{tips.map((tip, index) => (
										<div
											key={index}
											className="group/tip relative p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
										>
											<div className="flex items-start">
												<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-md group-hover/tip:scale-110 transition-transform duration-300">
													<AiOutlineCheckCircle
														size={16}
														className="text-white"
													/>
												</div>
												<p className="text-blue-900 dark:text-blue-100 leading-relaxed font-medium">
													{tip}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
										<HiSparkles size={24} className="text-blue-500" />
									</div>
									<p className="text-gray-600 dark:text-gray-400 text-lg">
										No tips available.
									</p>
								</div>
							)}
						</div>

						{/* DIY Solutions Section */}
						<div className="group backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
							<div className="flex items-center mb-8">
								<div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl mr-4 shadow-lg">
									<FaTools size={32} className="text-white" />
								</div>
								<div>
									<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">
										DIY Solutions
									</h2>
									<p className="text-gray-600 dark:text-gray-300 mt-1">
										Creative upcycling ideas
									</p>
								</div>
							</div>
							{diySolutions && diySolutions.length > 0 ? (
								<div className="space-y-4">
									{diySolutions.map((solution, index) => (
										<div
											key={index}
											className="group/diy relative p-6 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 rounded-2xl border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
										>
											<div className="flex items-start">
												<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-md group-hover/diy:scale-110 transition-transform duration-300">
													<FaTools size={12} className="text-white" />
												</div>
												<p className="text-purple-900 dark:text-purple-100 leading-relaxed font-medium">
													{solution}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-12">
									<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
										<FaTools size={24} className="text-purple-500" />
									</div>
									<p className="text-gray-600 dark:text-gray-400 text-lg">
										No DIY solutions available.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* YouTube Videos Carousel Section */}
					{youtubeVideos && youtubeVideos.length > 0 && (
						<div className="group backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500">
							<div className="flex items-center mb-8">
								<div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mr-4 shadow-lg">
									<FaYoutube size={36} className="text-white" />
								</div>
								<div>
									<h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
										Video Tutorials
									</h2>
									<p className="text-gray-600 dark:text-gray-300 mt-1">
										{youtubeVideos.length} expert DIY videos
									</p>
								</div>
							</div>

							{/* Carousel Container */}
							<div className="relative">
								{/* Modern Navigation Buttons - Only show if more than 4 videos */}
								{youtubeVideos.length > 4 && (
									<>
										<button
											onClick={prevVideo}
											className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md hover:from-gray-700/90 hover:to-gray-800/90 rounded-full p-3 shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 group/btn"
										>
											<AiOutlineLeft
												size={20}
												className="text-white group-hover/btn:-translate-x-0.5 transition-transform duration-300"
											/>
										</button>

										<button
											onClick={nextVideo}
											className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md hover:from-gray-700/90 hover:to-gray-800/90 rounded-full p-3 shadow-xl border border-white/20 transition-all duration-300 hover:scale-110 group/btn"
										>
											<AiOutlineRight
												size={20}
												className="text-white group-hover/btn:translate-x-0.5 transition-transform duration-300"
											/>
										</button>
									</>
								)}

								{/* Modern Videos Grid */}
								<div
									className={`grid gap-6 ${
										youtubeVideos.length > 4 ? "px-12" : ""
									} md:grid-cols-2 lg:grid-cols-4`}
								>
									{getVisibleVideos().map((video, index) => {
										const videoId = video.url.split("v=")[1]?.split("&")[0];
										const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

										return (
											<div
												key={`${video.index}-${index}`}
												className="group/video relative backdrop-blur-md bg-white/90 dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer border border-white/30"
												onClick={() => handleVideoClick(video.url)}
											>
												<div className="relative overflow-hidden rounded-t-2xl">
													<img
														src={thumbnailUrl}
														alt={`DIY Tutorial ${video.index + 1}`}
														className="w-full h-40 object-cover group-hover/video:scale-110 transition-transform duration-500"
														onError={(e) => {
															e.target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
														}}
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
													<div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover/video:opacity-100 flex items-center justify-center transition-all duration-300">
														<div className="bg-red-600/90 backdrop-blur-sm rounded-full p-4 shadow-xl transform scale-90 group-hover/video:scale-100 transition-transform duration-300">
															<FaYoutube size={32} className="text-white" />
														</div>
													</div>
													<div className="absolute top-3 right-3 bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
														{video.index + 1}/{youtubeVideos.length}
													</div>
												</div>
												<div className="p-5">
													<h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">
														DIY Tutorial {video.index + 1}
													</h3>
													<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
														<FaYoutube size={14} className="text-red-500" />
														<span>Watch on YouTube</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>

								{/* Modern Carousel Indicators - Only show if more than 4 videos */}
								{youtubeVideos.length > 4 && (
									<div className="flex justify-center mt-8 space-x-3">
										{Array.from({
											length: Math.ceil(youtubeVideos.length / 4),
										}).map((_, index) => (
											<button
												key={index}
												onClick={() => setCurrentVideoIndex(index * 4)}
												className={`h-2 rounded-full transition-all duration-500 hover:scale-125 ${
													Math.floor(currentVideoIndex / 4) === index
														? "w-8 bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
														: "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-red-300 dark:hover:bg-red-400"
												}`}
											/>
										))}
									</div>
								)}
							</div>
						</div>
					)}

					{/* Modern Call to Action */}
					<div className="text-center">
						<div className="group backdrop-blur-xl bg-gradient-to-br from-white/95 via-green-50/95 to-emerald-50/95 dark:from-gray-900/95 dark:via-green-900/20 dark:to-emerald-900/20 p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 max-w-3xl mx-auto">
							<div className="relative">
								{/* Decorative elements */}
								<div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
								<div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500"></div>

								<div className="flex items-center justify-center mb-6">
									<div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										<FaLeaf size={40} className="text-white" />
									</div>
								</div>

								<h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
									🌱 Start Your Recycling Journey
								</h3>

								<p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
									Transform waste into wonderful! Every recycled item
									contributes to a healthier planet and a sustainable future.
									Join millions making a difference, one item at a time.
								</p>

								<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
									<button
										onClick={handleBackToHome}
										className="group/btn bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg border border-white/20 backdrop-blur-sm"
									>
										<div className="flex items-center space-x-3">
											<FaRecycle
												size={20}
												className="group-hover/btn:rotate-180 transition-transform duration-500"
											/>
											<span>Recycle Another Item</span>
										</div>
									</button>

									<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
										<HiSparkles size={16} className="text-green-500" />
										<span className="font-medium">
											Making every action count
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Recycle;
