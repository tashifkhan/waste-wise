import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CameraAndGallery() {
	const [hasCameraAccess, setHasCameraAccess] = useState(false);
	const [galleryImage, setGalleryImage] = useState(null);
	const [capturedImage, setCapturedImage] = useState(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const fileInputRef = useRef(null);
	const navigate = useNavigate(); // React Router navigation

	useEffect(() => {
		const getCameraStream = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.onloadedmetadata = () => {
						videoRef.current.play();
					};
					setHasCameraAccess(true);
				}
			} catch (error) {
				console.error("Error accessing camera:", error);
				setHasCameraAccess(false);
			}
		};

		getCameraStream();

		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				const stream = videoRef.current.srcObject;
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
			}
		};
	}, []);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setGalleryImage(e.target.result);

				// Redirect to image display page with selected image from gallery
				navigate("/display-image", {
					state: { capturedImage: e.target.result },
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const captureImage = () => {
		if (videoRef.current && canvasRef.current) {
			const context = canvasRef.current.getContext("2d");
			canvasRef.current.width = videoRef.current.videoWidth;
			canvasRef.current.height = videoRef.current.videoHeight;
			context.drawImage(
				videoRef.current,
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height
			);
			const imageData = canvasRef.current.toDataURL("image/png");
			setCapturedImage(imageData);

			// Redirect to image display page with captured image
			navigate("/display-image", { state: { capturedImage: imageData } });
		} else {
			console.error("Video or canvas reference is missing");
		}
	};

	return (
		<div className="w-full h-full flex flex-col items-center justify-start p-4">
			{/* Camera Section */}
			<div className="w-full md:w-3/4 lg:w-1/2 h-3/4 relative mb-5">
				<h2 className="text-4xl mb-2 font-bold text-white text-center">
					Say Cheeeeezzzz!!!
				</h2>
				<video
					ref={videoRef}
					autoPlay
					className="w-full h-full object-cover rounded-lg border-4 border-white"
				/>
				<canvas ref={canvasRef} className="hidden" />
			</div>

			{/* Capture Photo Button */}
			<button
				onClick={captureImage}
				className="bg-green-500 mt-9 hover:bg-green-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md mb-5 text-lg"
			>
				Capture Photo
			</button>

			{/* Gallery Section */}
			<div className="w-full text-center">
				<h2 className="font-bold text-4xl text-white drop-shadow-md mb-3">
					Upload from Gallery
				</h2>

				<div className="text-center">
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						id="fileInput"
						className="hidden"
					/>
					<label
						htmlFor="fileInput"
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer text-lg inline-block"
					>
						Gallery
					</label>
				</div>

				{galleryImage && (
					<img
						src={galleryImage}
						alt="Selected from gallery"
						className="w-full h-auto mt-5"
					/>
				)}
			</div>
		</div>
	);
}

export default CameraAndGallery;
