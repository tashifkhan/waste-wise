import React from 'react';
import CameraAndGallery from '../components/CameraAndGallery'; // Ensure this path is correct
import LandingPageVid2 from '../Videos/LandingPageVid2.mp4';

const CameraPage = () => {
  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center', // Center content vertically
        justifyContent: 'center', // Center content horizontally
        backgroundColor: 'black', // Fallback background color
      }}
    >
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
          // zIndex: -1, // Ensure the video is behind the content
        }}
      >
        <source src={LandingPageVid2} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div
       style={{
        width: '75vw', // 3/4 of the screen width
        height: '90vh', // 90% of the screen height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '20px',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.1)', // Light background with transparency
        // backdropFilter: 'blur(10px) saturate(180%)', // Blur and saturation for crystal effect
        // webkitBackdropFilter: 'blur(10px) saturate(180%)', // Ensure cross-browser support
        borderRadius: '20%', // Rounded corners
        border: '1px solid rgba(255, 255, 255, 0.18)', // Subtle border for added depth
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Shadow for 3D effect
        overflow: 'hidden',
      }}
      
      >
        <CameraAndGallery />
      </div>
    </div>
  );
};

export default CameraPage;
