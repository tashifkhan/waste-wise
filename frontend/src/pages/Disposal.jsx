import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	AiOutlineArrowLeft,
	AiOutlineDelete,
	AiOutlineCheckCircle,
} from "react-icons/ai";
import {
	FaTrash,
	FaLeaf,
	FaExclamationTriangle,
	FaLightbulb,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const Disposal = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [isVisible, setIsVisible] = useState(false);

	// Retrieve the passed state from the previous page
	const { disposalMethods, tips, wasteName, wasteType } = location.state || {};

	useEffect(() => {
		// Trigger entrance animation
		setIsVisible(true);
	}, []);

	const handleBackToHome = () => {
		navigate("/");
	};

	return (
		<div className="relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden">
			{/* Modern Video Background */}
			<video
				autoPlay
				muted
				loop
				className="absolute inset-0 w-full h-full object-cover scale-105"
				src={LandingPageVid2}
				type="video/mp4"
			/>

			{/* Modern gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-black/60 via-red-900/30 to-black/70" />

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
						<div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
							<FaTrash size={32} />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-300 to-red-400 bg-clip-text text-transparent">
							Disposal Guide
						</h1>
					</div>
					<div className="w-32"></div> {/* Spacer for centering */}
				</div>

				{/* Main Content */}
				<div className="w-full max-w-6xl mx-auto space-y-8">
					{/* Disposal Methods Section */}
					<div className="group backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
						<div className="flex items-center mb-8">
							<div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mr-4 shadow-lg">
								<FaExclamationTriangle size={32} className="text-white" />
							</div>
							<div>
								<h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
									Disposal Methods
								</h2>
								<p className="text-gray-600 dark:text-gray-300 mt-1">
									Safe disposal procedures
								</p>
							</div>
						</div>
						{disposalMethods && disposalMethods.length > 0 ? (
							<div className="space-y-4">
								{disposalMethods.map((method, index) => (
									<div
										key={index}
										className="group/method relative p-6 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl border-l-4 border-red-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
									>
										<div className="flex items-start">
											<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-md group-hover/method:scale-110 transition-transform duration-300">
												<span className="text-white font-bold text-sm">
													{index + 1}
												</span>
											</div>
											<div>
												<h3 className="font-bold text-red-900 dark:text-red-100 text-lg mb-2">
													Method {index + 1}
												</h3>
												<p className="text-red-800 dark:text-red-200 leading-relaxed">
													{method}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaExclamationTriangle size={24} className="text-red-500" />
								</div>
								<p className="text-gray-600 dark:text-gray-400 text-lg">
									No disposal methods available.
								</p>
							</div>
						)}
					</div>

					{/* Tips Section */}
					<div className="group backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 p-8 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
						<div className="flex items-center mb-8">
							<div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl mr-4 shadow-lg">
								<FaLightbulb size={32} className="text-white" />
							</div>
							<div>
								<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
									Disposal Tips
								</h2>
								<p className="text-gray-600 dark:text-gray-300 mt-1">
									Expert safety advice
								</p>
							</div>
						</div>
						{tips && tips.length > 0 ? (
							<div className="space-y-4">
								{tips.map((tip, index) => (
									<div
										key={index}
										className="group/tip relative p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
									>
										<div className="flex items-start">
											<div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 shadow-md group-hover/tip:scale-110 transition-transform duration-300">
												<AiOutlineCheckCircle
													size={16}
													className="text-white"
												/>
											</div>
											<p className="text-orange-900 dark:text-orange-100 leading-relaxed font-medium">
												{tip}
											</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaLightbulb size={24} className="text-orange-500" />
								</div>
								<p className="text-gray-600 dark:text-gray-400 text-lg">
									No tips available.
								</p>
							</div>
						)}
					</div>

					{/* Modern Call to Action */}
					<div className="text-center">
						<div className="group backdrop-blur-xl bg-gradient-to-br from-white/95 via-red-50/95 to-orange-50/95 dark:from-gray-900/95 dark:via-red-900/20 dark:to-orange-900/20 p-10 rounded-3xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-500 max-w-3xl mx-auto">
							<div className="relative">
								{/* Decorative elements */}
								<div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
								<div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500"></div>

								<div className="flex items-center justify-center mb-6">
									<div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										<FaLeaf size={40} className="text-white" />
									</div>
								</div>

								<h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
									🌍 Make a Difference
								</h3>

								<p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
									Every small action counts! Proper disposal helps protect our
									environment and creates a sustainable future for generations
									to come.
								</p>

								<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
									<button
										onClick={handleBackToHome}
										className="group/btn bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg border border-white/20 backdrop-blur-sm"
									>
										<div className="flex items-center space-x-3">
											<FaTrash
												size={20}
												className="group-hover/btn:rotate-12 transition-transform duration-500"
											/>
											<span>Dispose Another Item</span>
										</div>
									</button>

									<div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
										<HiSparkles size={16} className="text-green-500" />
										<span className="font-medium">
											Protecting our planet together
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

export default Disposal;
