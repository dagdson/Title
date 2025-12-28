import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOpinionDetails, updateRequirement } from '../api';

const DTODetail = () => {
    const { id } = useParams();
    const [opinion, setOpinion] = useState(null);
    const [selectedReq, setSelectedReq] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const response = await getOpinionDetails(id);
            setOpinion(response.data);
            if (response.data.requirements.length > 0) {
                 // default select first
                 setSelectedReq(response.data.requirements[0]);
            }
        } catch (error) {
            console.error("Failed to fetch details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reqId, newStatus) => {
        try {
            await updateRequirement(reqId, { status: newStatus });
            // Update local state
            setOpinion(prev => ({
                ...prev,
                requirements: prev.requirements.map(r => r.id === reqId ? { ...r, status: newStatus } : r)
            }));
            if (selectedReq && selectedReq.id === reqId) {
                setSelectedReq(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleAssigneeChange = async (reqId, assignee) => {
         try {
            await updateRequirement(reqId, { assignee });
             // Update local state
            setOpinion(prev => ({
                ...prev,
                requirements: prev.requirements.map(r =>
                    r.id === reqId ? { ...r, curative_task: { ...r.curative_task, assignee } } : r
                )
            }));
            if (selectedReq && selectedReq.id === reqId) {
                 setSelectedReq(prev => ({
                     ...prev,
                     curative_task: { ...prev.curative_task, assignee }
                 }));
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!opinion) return <div>Opinion not found</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <Link to="/">Back to Dashboard</Link>
                <h2>{opinion.filename} - Curative Workbench</h2>
            </div>

            <div style={{ display: 'flex', flex: 1, gap: '20px' }}>
                {/* Left Panel: Requirements List */}
                <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
                    <h3>Requirements ({opinion.requirements.length})</h3>
                    {opinion.requirements.map(req => (
                        <div
                            key={req.id}
                            onClick={() => setSelectedReq(req)}
                            style={{
                                padding: '10px',
                                border: '1px solid #eee',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                backgroundColor: selectedReq && selectedReq.id === req.id ? '#f0f8ff' : 'white',
                                borderLeft: `5px solid ${req.severity === 'FATAL' ? 'red' : 'orange'}`
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>Requirement #{req.description.match(/Requirement (\d+)/)?.[1] || '?'}</div>
                            <div style={{ fontSize: '0.8em', color: '#666' }}>{req.severity} - {req.status}</div>
                            <div style={{ fontSize: '0.9em', marginTop: '5px' }}>{req.description.substring(0, 100)}...</div>
                        </div>
                    ))}

                    <h3>Tracts ({opinion.tracts.length})</h3>
                    {opinion.tracts.map(t => (
                        <div key={t.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                            <small>{t.description}</small>
                        </div>
                    ))}
                </div>

                {/* Right Panel: Workbench / Details */}
                <div style={{ flex: 2, border: '1px solid #ccc', borderRadius: '5px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    {selectedReq ? (
                        <>
                            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fafafa', border: '1px solid #ddd' }}>
                                <h4>Extraction View (Source Simulation)</h4>
                                <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                    {/* In a real app, this would highlight the text in PDF. For MVP, we show text. */}
                                    {selectedReq.description}
                                    {/* We could potentially store full text in DB if extracted properly */}
                                </p>
                            </div>

                            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                <h4>Curative Actions</h4>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold' }}>Status:</label>
                                    <select
                                        value={selectedReq.status}
                                        onChange={(e) => handleStatusChange(selectedReq.id, e.target.value)}
                                        style={{ padding: '5px', width: '200px' }}
                                    >
                                        <option value="OPEN">OPEN</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="CURED">CURED</option>
                                        <option value="WAIVED">WAIVED</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold' }}>Assign Broker:</label>
                                    <input
                                        type="text"
                                        placeholder="Enter broker name..."
                                        value={selectedReq.curative_task?.assignee || ''}
                                        onChange={(e) => handleAssigneeChange(selectedReq.id, e.target.value)}
                                        style={{ padding: '5px', width: '300px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', fontWeight: 'bold' }}>Notes:</label>
                                    <textarea
                                        rows="4"
                                        style={{ width: '100%', padding: '5px' }}
                                        value={selectedReq.curative_task?.notes || ''}
                                        readOnly // MVP read-only for now or add update logic
                                        placeholder="Notes functionality..."
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Select a requirement to view details.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DTODetail;
