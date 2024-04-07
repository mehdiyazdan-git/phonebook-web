import React, { useState } from 'react';

function FileUploadForm({ onSubmit }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (file && onSubmit) {
            const formData = new FormData();
            formData.append('file', file);
            await onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            {preview && (
                <div style={{ maxWidth: '30%', maxHeight: '100px', overflow: 'hidden' }}>
                    {file.type.startsWith('image/') ? (
                        <img src={preview} alt="Uploaded" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                    ) : (
                        <embed src={preview} type="application/pdf" style={{ width: '100%', height: '300px', objectFit: 'contain' }} />
                    )}
                </div>
            )}
            <button type="submit">Submit</button>
        </form>
    );
}

export default FileUploadForm;
