import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Banner = ({name,type,desc}) => {
  const [waste, setWaste] = useState(''); 
  const [type, setType] = useState('');
  const [error, setError] = useState(''); 
  const [recycleData, setRecycleData] = useState(null);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/img_processing', {
          // Pass necessary data here if required for the image processing
        });

        // Assuming the API returns the following data structure
        setWaste(response.data.name); // Setting waste name
        setType(response.data.type); // Setting waste type
        setError(response.data.error || ''); // Handling any error messages from the API
      } catch (error) {
        setError('Failed to fetch data.'); // Handling request errors
      }
    };

    fetchWasteData(); 
  }, []);

  const handleRecycle = async () => {
    try {
      // First API Call: Generate Recycling Methods
      const recycleResponse = await axios.post('http://localhost:5000/generate_recycle', {
        name_item: name || waste, // Use either the prop or fetched waste name
        type: type || wasteType, // Use either the prop or fetched waste type
        desc: desc || 'No description provided', // Pass description or a fallback
      });

      setRecycleData(recycleResponse.data); // Set recycling data
      setError(recycleResponse.data.error || ''); // Handle any errors from the response

      // Second API Call: Fetch YouTube videos
      const youtubeResponse = await axios.post('http://localhost:5000/youtube_search', {
        name_item: name || waste, // Use waste name to search for DIY videos
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
      setError('Failed to process recycling or fetch YouTube videos.'); // Handle request errors
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full bg-gradient-to-b from-blue-300 to-blue-500 p-6">
      {/* Top Section: Waste Information */}
      <div className="text-center text-green-800 font-bold">
        <p className="text-2xl mb-2">WASTE</p>
        <p className="text-4xl mb-2 text-white">
          {name || 'Loading...'} {/* Display fetched waste or loading state */}
        </p>
        <p className="text-xl mb-4">TYPE</p>
        <p className="text-3xl mb-6 text-white">
          {type || 'Loading...'} {/* Display fetched type or loading state */}
        </p>
      </div>

      {/* Button Section */}
      <div className="flex justify-center space-x-6 mb-6">
        <button className="bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700"
        onClick={handleDispose}>
          DISPOSE
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700"
        onClick={handleRecycle}>
          RECYCLE
        </button>
      </div>

      {/* Error Display */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default Banner;
