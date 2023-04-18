import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies  from 'js-cookie';
import './signature-page-container.css';

function SignaturePage({onLogout} ) {
  const API = 'http://13.67.71.103:10989';
  const [image, setImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [signature, defineSignature] = useState(null)
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = Cookies.get('token');
    // Create a FormData object to send the image file to the server
    const formData = new FormData();
    formData.append('image', image);
    console.log(token)
    axios
      .post(`${API}/generate-signature`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUploadSuccess(true);
        defineSignature(response.data.signature)
        console.log(signature)
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setUploadError('Upload failed. Server error, please try again later.');
        } else {
          setUploadError('Upload failed. Please check your file and try again.');
        }
        console.error(error);
      });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // perform logout operation here
    Cookies.remove('token');
    onLogout()
    navigate('/login');
  };

  return (
    <div className="signature-page-container">
      <div>
        <h2>Signature Page</h2>
        {uploadError && <div className="error">{uploadError}</div>}
        {uploadSuccess && <div className="success">Upload successful!</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="image">Upload image:</label>
            <input type="file" id="image" onChange={handleImageChange} />
          </div>
          <button type="submit">submit</button>
        </form>
        {signature && <div>Generated signature: {signature}</div>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default SignaturePage;
