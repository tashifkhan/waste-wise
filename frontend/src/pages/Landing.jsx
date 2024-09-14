import React from 'react';
import InfiniteLandingPage from '../components/InfiniteLandingPage';
import LandingPageVid2 from '../Videos/LandingPageVid2.mp4';

const Landing = () => {
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        {/* Big Heading */}
        <h1 className="text-5xl md:text-7xl font-bold">Our Heroes</h1>

        {/* Leaderboard Component with scrolling/overflow */}
        <div className=" w-full  h-[70vh] overflow-auto">
          <InfiniteLandingPage />
        </div>

        {/* Green Add Button */}
        <button className="absolute bottom-5 left-auto bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600">
          Add Image of your waste 
        </button>
      </div>
    </div>
  );
};

export default Landing;
