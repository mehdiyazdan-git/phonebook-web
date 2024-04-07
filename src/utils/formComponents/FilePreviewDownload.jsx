import React from 'react';

const FilePreviewDownload = ({ fileData, fileName, fileType }) => {
    const fileBlob = new Blob([fileData], { type: fileType });
    const fileUrl = URL.createObjectURL(fileBlob);

    return (
        <div>
            <h3>File Preview:</h3>
            {fileType.startsWith('image/') ? (
                <img src={fileUrl} alt={fileName} style={{ maxWidth: '300px', maxHeight: '300px' }} />
            ) : fileType === 'application/pdf' ? (
                <embed src={fileUrl} type="application/pdf" width="100%" height="300px" />
            ) : (
                <p>Preview not available for this file type.</p>
            )}
            <div>
                <a href={fileUrl} download={fileName}>
                    Download File
                </a>
            </div>
        </div>
    );
};

export default FilePreviewDownload;
