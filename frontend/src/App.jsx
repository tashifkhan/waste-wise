import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CameraPage from "./pages/CameraPage";
import CapturedImage from "./pages/CapturedImage";
import LandingPage from "./pages/Landing";
import Banner from "./pages/Banner";
import Recycle from "./pages/Recycle";
import Disposal from "./pages/Disposal";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/CameraPage" element={<CameraPage />} />
				<Route path="/display-image" element={<CapturedImage />} />
				<Route path="/Information" element={<Banner />} />
				<Route path="/recycle" element={<Recycle />} />
				<Route path="/disposal" element={<Disposal />} />
			</Routes>
		</Router>
	);
}

export default App;
