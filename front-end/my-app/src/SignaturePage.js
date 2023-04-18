import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './signature-page-container.css';

function SignaturePage({ onLogout }) {
  const API = 'http://13.67.71.103:10989';
  const [image, setImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [signature, setSignature] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    onLogout();
    navigate('/login');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = Cookies.get('token');

    // Check if the uploaded file is a valid image file
    if (image && !['image/png', 'image/jpg', 'image/jpeg'].includes(image.type)) {
      setUploadError('Image must be in PNG, JPG or JPEG format.');
      return;
    }

    // Create a FormData object to send the image file to the server
    const formData = new FormData();
    formData.append('image', image);

    axios
      .post(`${API}/generate-signature`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUploadSuccess(true);
        setSignature(response.data.signature);
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 500) {
          setUploadError('Upload failed. Server error, please try again later.');
        } else if (error.response.status === 403) {
          let countdown = 5; // Countdown time in seconds
          const timer = setInterval(() => {
            setUploadError(
              `Signature Generator Token has expired, you will be redirected to the login page in ${countdown} seconds.`
            );
            countdown -= 1;
            if (countdown < 0) {
              clearInterval(timer);
              handleLogout();
            }
          }, 1000);
        } else if (error.response.status === 401) {
          setUploadError('Please upload one file.');
        }
        console.error(error);
      });
  };

  return (
    <div className="signature-page-container">
      <div>
        <h2>Signature Page</h2>
        {uploadError && <div className="error">{uploadError}</div>}
        {uploadSuccess && <div className="success">Image uploaded and signature generated successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="image">Upload image:</label>
            <input type="file" id="image" accept=".png,.jpg,.jpeg" onChange={handleImageChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
        {signature && <div>Generated signature: {signature}</div>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default SignaturePage;
