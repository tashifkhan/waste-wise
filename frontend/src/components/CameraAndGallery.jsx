import React, { useState, useRef, useEffect } from 'react';

function CameraAndGallery() {
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [galleryImage, setGalleryImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
          setHasCameraAccess(true);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
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
      };
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setCapturedImage(canvasRef.current.toDataURL('image/png'));
    } else {
      console.error('Video or canvas reference is missing');
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      {/* Camera Section */}
      <div style={{ width: '70%', height: '70%', position: 'relative', marginBottom: '20px' }}>
        <h2 className='text-4xl mb-2 font-bold' style={{ color: 'White', textAlign: 'center' }}>Say Cheeeeezzzz!!!</h2>
        <video
          ref={videoRef}
          autoPlay
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px',    border: '5px solid white', }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {capturedImage && (
          <div style={{ marginTop: '20px', width: '100%' }}>
            <h3 style={{ color: 'white', textAlign: 'center' }}>Captured Image</h3>
            <img
              src={capturedImage}
              alt="Captured from camera"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}
      </div>

      {/* Capture Photo Button */}
      <button
        onClick={captureImage}
        className="bg-green-500 mt-9 hover:bg-green-600 text-white font-bold  px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md"
        style={{ marginBottom: '20px', fontSize: '1.2rem' }}
      >
        Capture Photo
      </button>

      {/* Gallery Section */}
      <div style={{ width: '100%', textAlign: 'center' }}>
      <h2 className='font-bold text-4xl text-white drop-shadow-md' style={{ color: 'white', fontSize: '1.7rem', marginBottom: '3px' }}>
  Upload from Gallery
</h2>

<div style={{ textAlign: 'center' }}>
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleFileChange}
    id="fileInput"
    style={{ display: 'none' }} // Hide the default file input
  />
  <label
    htmlFor="fileInput"
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
    style={{ fontSize: '1.2rem', display: 'inline-block' }}
  >
    Gallery
  </label>
</div>

        {galleryImage && (
          <img
            src={galleryImage}
            alt="Selected from gallery"
            style={{ width: '100%', height: 'auto', marginTop: '20px' }}
          />
        )}
      </div>
    </div>
  );
}

export default CameraAndGallery;
