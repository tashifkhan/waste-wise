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
        tracks.forEach((track) => {
          track.stop();
        });
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
    <div>
      <div>
        <h2>Camera Feed</h2>
        {true ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              style={{ width: '100%', height: '700px' }}
            />
            <button onClick={captureImage} style={{ display: 'block', margin: '10px 0' }}>
              Capture Photo
            </button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {capturedImage && (
              <div>
                <h3>Captured Image</h3>
                <img
                  src={capturedImage}
                  alt="Captured from camera"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            )}
          </>
        ) : (
          <p>Access to camera is not granted or an error occurred.</p>
        )}
      </div>

      <div>
        <h2>Gallery</h2>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'block', margin: '10px 0' }}
        />
        {galleryImage && (
          <img
            src={galleryImage}
            alt="Selected from gallery"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
      </div>
    </div>
  );
}

export default CameraAndGallery;
