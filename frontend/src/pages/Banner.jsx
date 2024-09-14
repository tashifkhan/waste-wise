import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material'; // Material UI spinner

const Banner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the passed state from the previous page (name, type, and desc)
  const { name, type, desc } = location.state || {};

  const [recycleData, setRecycleData] = useState(null);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name || !type) {
      setError('Missing necessary information for the request.');
    }
  }, [name, type]);

  const handleRecycle = async () => {
    setLoading(true); // Start loading state

    try {
      // First API Call: Generate Recycling Methods
      const recycleResponse = await axios.post('http://localhost:5000/generate_recycle', {
        name_item: name,
        type: type,
        desc: desc || 'No description provided',
      });

      setRecycleData(recycleResponse.data); // Set recycling data
      setError(recycleResponse.data.error || ''); // Handle any errors from the response

      // Second API Call: Fetch YouTube videos
      const youtubeResponse = await axios.post('http://localhost:5000/youtube_search', {
        name_item: name, // Use waste name to search for DIY videos
      });

      if (youtubeResponse.data.error === "none") {
        setYoutubeVideos(youtubeResponse.data.video_links); // Set YouTube video links
      } else {
        setError('Error fetching YouTube videos.');
      }

      // If both APIs succeed, navigate to the /recycle page with all the data
      if (!recycleResponse.data.error && youtubeResponse.data.error === "none") {
        navigate('/recycle', {
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
      setError('Failed to process recycling or fetch YouTube videos.'); // Handle request errors
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gradient-to-br from-blue-200 to-blue-600 p-8">
      {/* Top Section: Waste Information */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-xl font-semibold text-gray-800">WASTE</p>
        <p className="text-2xl font-bold text-blue-800 mb-2">
          {name || 'Loading...'}
        </p>
        <p className="text-lg font-semibold text-gray-800">TYPE</p>
        <p className="text-2xl font-bold text-blue-800 mb-6">
          {type || 'Loading...'}
        </p>
      </div>

      {/* Button Section */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition duration-300"
          onClick={handleRecycle}
        >
          RECYCLE
        </button>
        <button
          className="bg-red-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-700 transition duration-300"
        >
          DISPOSE
        </button>
      </div>

      {/* Loading and Error Display */}
      {loading && (
        <div className="flex items-center justify-center mt-6">
          <CircularProgress color="secondary" />
        </div>
      )}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Banner;
