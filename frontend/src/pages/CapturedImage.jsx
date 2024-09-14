import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BGVideo from '../Videos/LandingPageVid2.mp4';
function CapturedImage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { capturedImage } = location.state || {};

  if (!capturedImage) {
    return <h2>No image captured. Go back to the camera.</h2>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1, // Ensure the video stays behind the content
        }}
      >
        <source src={BGVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Captured Image and Button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
          Captured Image
        </h1>
        <img
          src={capturedImage}
          alt="Captured"
          style={{
            width: '45%',
            height: '70%',
            borderRadius: '10px',
            border: '10px solid white', // Bold white border
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // Optional shadow for extra effect
          }}
        />
         <button
          onClick={() => navigate('/')}
          className="bg-green-500 mt-9 hover:bg-green-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md"
          style={{ fontSize: '1.2rem', marginTop: '20px' }}
        >
          Confirm
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 mt-9 hover:bg-green-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md"
          style={{ fontSize: '1.2rem', marginTop: '20px' }}
        >
          Go Back to Camera
        </button>
      </div>
    </div>
  );
}

export default CapturedImage;
