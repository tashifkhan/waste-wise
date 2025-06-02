import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineDelete } from "react-icons/ai";
import LandingPageVid2 from "../Videos/LandingPageVid2.mp4";

const Disposal = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Retrieve the passed state from the previous page
	const { disposalMethods, tips, wasteName, wasteType } = location.state || {};

	const handleBackToHome = () => {
		navigate("/");
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
						<AiOutlineDelete size={36} className="mr-3" />
						Disposal Methods
					</h1>
					<div className="w-32"></div> {/* Spacer for centering */}
				</div>

				{/* Main Content */}
				<div className="w-full max-w-6xl mx-auto grid gap-8 md:grid-cols-1 lg:grid-cols-2">
					{/* Disposal Methods Section */}
					<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg">
						<h2 className="text-2xl md:text-3xl font-bold text-red-800 mb-6 flex items-center">
							<AiOutlineDelete size={28} className="mr-3" />
							Disposal Methods
						</h2>
						{disposalMethods && disposalMethods.length > 0 ? (
							<div className="space-y-4">
								{disposalMethods.map((method, index) => (
									<div
										key={index}
										className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
									>
										<h3 className="font-semibold text-red-900 text-lg mb-2">
											Method {index + 1}
										</h3>
										<p className="text-red-800">{method}</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-600 text-lg">
								No disposal methods available.
							</p>
						)}
					</div>

					{/* Tips Section */}
					<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-lg">
						<h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-6">
							💡 Disposal Tips
						</h2>
						{tips && tips.length > 0 ? (
							<div className="space-y-4">
								{tips.map((tip, index) => (
									<div
										key={index}
										className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg"
									>
										<div className="flex items-start">
											<span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">
												{index + 1}
											</span>
											<p className="text-orange-900 leading-relaxed">{tip}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-600 text-lg">No tips available.</p>
						)}
					</div>
				</div>

				{/* Call to Action */}
				<div className="mt-12 text-center">
					<div className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
						<h3 className="text-xl font-bold text-gray-800 mb-4">
							🌍 Make a Difference
						</h3>
						<p className="text-gray-700 mb-6">
							Every small action counts! Proper disposal helps protect our
							environment and creates a sustainable future for generations to
							come.
						</p>
						<button
							onClick={handleBackToHome}
							className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition duration-300 font-semibold"
						>
							Dispose Another Item
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Disposal;
