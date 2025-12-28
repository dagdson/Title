import React, { useState } from 'react';
import { uploadOpinion } from '../api';

const UploadDTO = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            await uploadOpinion(file);
            setMessage('Upload successful!');
            setFile(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            console.error(error);
            setMessage('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
            <h3>Upload Digital Title Opinion</h3>
            <input type="file" onChange={handleFileChange} accept=".pdf" />
            <button onClick={handleUpload} disabled={uploading || !file} style={{ marginLeft: '10px' }}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadDTO;
