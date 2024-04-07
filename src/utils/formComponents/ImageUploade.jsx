import React, { useState } from 'react';
import styled from 'styled-components';

const ImageUploaderContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  .card {
    position: relative;
    padding: 2.5rem 1.5rem 2rem;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.2);
    max-width: 28rem;
    border-radius: 0.375rem;
    margin: 0 auto;

    .divider {
      padding: 2rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      h1 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #2563EB;
      }

      input {
        width: 100%;
        padding: 0.5rem;
        border: 2px solid #cbd5e0;
        border-radius: 0.375rem;
        outline: none;
        transition: border 0.2s;

        &:focus {
          border-color: #2563EB;
        }
      }

      img {
        margin-top: 1rem;
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
    }
  }
`;

export default function ImageUploader() {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <ImageUploaderContainer>
            <div className="card">
                <div className="divider">
                    <h1>Image Uploader</h1>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {image && <img src={image} alt="Uploaded" />}
                </div>
            </div>
        </ImageUploaderContainer>
    );
}
