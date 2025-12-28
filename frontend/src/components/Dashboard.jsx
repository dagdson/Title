import React, { useEffect, useState } from 'react';
import { getOpinions } from '../api';
import UploadDTO from './UploadDTO';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [opinions, setOpinions] = useState([]);

    const fetchOpinions = async () => {
        try {
            const response = await getOpinions();
            setOpinions(response.data);
        } catch (error) {
            console.error("Failed to fetch opinions", error);
        }
    };

    useEffect(() => {
        fetchOpinions();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <UploadDTO onUploadSuccess={fetchOpinions} />

            <h3>Uploaded Title Opinions</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Filename</th>
                        <th style={{ padding: '10px' }}>Upload Date</th>
                        <th style={{ padding: '10px' }}>Defects (Total)</th>
                        <th style={{ padding: '10px' }}>Fatal</th>
                        <th style={{ padding: '10px' }}>Advisory</th>
                        <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {opinions.map(op => (
                        <tr key={op.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{op.id}</td>
                            <td style={{ padding: '10px' }}>{op.filename}</td>
                            <td style={{ padding: '10px' }}>{new Date(op.upload_date).toLocaleString()}</td>
                            <td style={{ padding: '10px' }}>{op.stats.total_requirements}</td>
                            <td style={{ padding: '10px', color: 'red', fontWeight: 'bold' }}>{op.stats.fatal}</td>
                            <td style={{ padding: '10px', color: 'orange' }}>{op.stats.advisory}</td>
                            <td style={{ padding: '10px' }}>
                                <Link to={`/opinion/${op.id}`}>Open Workbench</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
