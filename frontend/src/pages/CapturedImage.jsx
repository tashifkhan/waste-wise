import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BGVideo from '../Videos/LandingPageVid2.mp4';

function CapturedImage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { capturedImage } = location.state || {};
  const [processingResult, setProcessingResult] = useState(null); // To store backend response
  const [loading, setLoading] = useState(false); // To show loading state

  if (!capturedImage) {
    return <h2>No image captured. Go back to the camera.</h2>;
  }

  const handleConfirmClick = async () => {
    setLoading(true);
    const formData = new FormData();

    // Convert the captured image (Blob or File) to a file and append to FormData
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });

    formData.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setProcessingResult(result); // Store the response from the backend
      } else {
        console.error('Error processing image:', res.statusText);
        setProcessingResult({ error: 'Failed to process image' });
      }
    } catch (error) {
      console.error('Error:', error);
      setProcessingResult({ error: 'An error occurred during image upload' });
    } finally {
      setLoading(false);
    }
  };

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
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}
        >
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
        {/* Display Loading or Result */}
        {loading ? (
          <p style={{ color: 'white', marginTop: '20px' }}>Processing image...</p>
        ) : (
          processingResult && (
            <div style={{ color: 'white', marginTop: '20px' }}>
              {processingResult.error ? (
                <p>Error: {processingResult.error}</p>
              ) : (
                <div>
                  <p><strong>Name:</strong> {processingResult.name}</p>
                  <p><strong>Type:</strong> {processingResult.type}</p>
                  <p><strong>Description:</strong> {processingResult.desc}</p>
                </div>
              )}
            </div>
          )
        )}
        {/* Confirm Button */}
        <button
          onClick={handleConfirmClick}
          className="bg-green-500 mt-9 hover:bg-green-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md"
          style={{ fontSize: '1.2rem', marginTop: '20px' }}
        >
          Confirm
        </button>
        {/* Go Back Button */}
        <button
          onClick={() => navigate('/CameraPage')}
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
