import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BGVideo from "../Videos/LandingPageVid2.mp4";

function CapturedImage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { capturedImage } = location.state || {};
	const [processingResult, setProcessingResult] = useState(null);
	const [loading, setLoading] = useState(false);

	if (!capturedImage) {
		return (
			<h2 className="text-center text-2xl mt-10">
				No image captured. Go back to the camera.
			</h2>
		);
	}

	const handleConfirmClick = async () => {
		setLoading(true);
		const formData = new FormData();

		try {
			console.log("Fetching image from:", capturedImage);
			const response = await fetch(capturedImage);
			const blob = await response.blob();
			console.log("Fetched blob:", blob);

			const file = new File([blob], "captured-image.png", {
				type: "image/png",
			});
			console.log("Created file:", file);

			formData.append("file", file);

			const res = await fetch("http://127.0.0.1:5000/img_processing", {
				method: "POST",
				body: formData,
			});

			console.log("Response status:", res.status);

			if (res.ok) {
				const result = await res.json();
				setProcessingResult(result);
				navigate("/Information", {
					state: {
						name: result.name,
						type: result.type,
						desc: result.desc,
					},
				});
			} else {
				console.error("Error processing image:", res.statusText);
				setProcessingResult({ error: "Failed to process image" });
			}
		} catch (error) {
			console.error("Error:", error);
			setProcessingResult({ error: "An error occurred during image upload" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative h-screen overflow-hidden">
			<video
				autoPlay
				loop
				muted
				className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
			>
				<source src={BGVideo} type="video/mp4" />
				Your browser does not support the video tag.
			</video>

			<div className="flex flex-col items-center justify-center h-full">
				<h1 className="text-3xl font-bold mb-4 text-white text-shadow-lg">
					Captured Image
				</h1>
				<img
					src={capturedImage}
					alt="Captured"
					className="w-11/12 md:w-2/3 lg:w-1/2 h-auto rounded-lg border-4 border-white shadow-lg"
				/>
				{loading ? (
					<p className="text-white mt-5">Processing image...</p>
				) : (
					processingResult && (
						<div className="text-white mt-5">
							{processingResult.error ? (
								<p>Error: {processingResult.error}</p>
							) : (
								<p>Redirecting to the next component...</p>
							)}
						</div>
					)
				)}
				<button
					onClick={handleConfirmClick}
					className="bg-green-500 mt-5 hover:bg-green-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md text-lg"
				>
					Confirm
				</button>
				<button
					onClick={() => navigate("/CameraPage")}
					className="bg-green-500 mt-5 hover:bg-green-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md text-lg"
				>
					Go Back to Camera
				</button>
			</div>
		</div>
	);
}

export default CapturedImage;
