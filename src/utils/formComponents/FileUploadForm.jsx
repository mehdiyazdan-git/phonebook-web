import React, { useEffect, useState } from 'react';
import "./FileUploadForm.css";

function FileUploadForm({ id, onSubmit }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetch(`/api/files/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const fileObject = new File([blob], `fetchedFile.${blob.type.split('/')[1]}`, { type: blob.type });
                    setFile(fileObject);
                    setPreview(URL.createObjectURL(blob));
                })
                .catch(error => {
                    console.error("Fetching file failed", error);
                    // Add any additional error handling here
                })
                .finally(() => setIsLoading(false));
        }
    }, [id]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setIsUploaded(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            setIsLoading(true);
            try {
                await onSubmit(formData);
                setIsUploaded(true);
            } catch (error) {
                console.error('Upload failed', error);
                // Add any additional error handling here
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderPreview = () => {
        if (isLoading) {
            return <p>Loading...</p>;
        }
        if (isUploaded || (id && preview)) {
            return (
                <div className="file-preview-container">
                    {file.type.startsWith('image/') ? (
                        <img src={preview} alt="Uploaded" className="file-preview-image" />
                    ) : (
                        <embed src={preview} type={file.type} className="file-preview-pdf" />
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="file-preview-container">
                    <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            {renderPreview()}
            {!isUploaded && !id && (
                <form onSubmit={handleSubmit}>
                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    );
}

export default FileUploadForm;
