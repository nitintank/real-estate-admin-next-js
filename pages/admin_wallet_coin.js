import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/WalletCoin.module.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddWalletCoin = () => {
    const [agents, setAgents] = useState([]);
    const [properties, setProperties] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [coins, setCoins] = useState('');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    // Utility function to check if the token has expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const { exp } = JSON.parse(jsonPayload);
        const currentTime = Math.floor(Date.now() / 1000);

        return exp < currentTime;
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        // If token is not found or token is expired, redirect to login
        if (!accessToken || !username || isTokenExpired(accessToken)) {
            location.href = "/login";
        }
    }, []);

    useEffect(() => {
        fetch('https://a.khelogame.xyz/all_agents')
            .then(response => response.json())
            .then(data => setAgents(data))
            .catch(error => console.error("Error fetching agents!", error));
    }, []);

    useEffect(() => {
        if (selectedAgent) {
            fetch(`https://a.khelogame.xyz/get-agent-properties?agent_id=${selectedAgent}`)
                .then(response => response.json())
                .then(data => setProperties(data))
                .catch(error => console.error("Error fetching properties!", error));
        } else {
            setProperties([]);
        }
    }, [selectedAgent]);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleAgentChange = (e) => setSelectedAgent(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const selectedAgentObj = agents.find(agent => agent.id === parseInt(selectedAgent));
        const selectedPropertyObj = properties.find(property => property.id === parseInt(selectedProperty));

        if (!selectedAgentObj || !selectedPropertyObj) {
            setLoading(false);
            alert('Selected agent or property not found');
            return;
        }

        const data = {
            agent_id: selectedAgent,
            agent_name: selectedAgentObj.name,
            property_name: selectedPropertyObj.property_name,
            property_id: selectedProperty,
            coins: parseInt(coins)
        };

        fetch('https://a.khelogame.xyz/admin/create-wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);

                toast.success('Wallet created successfully!');
                fetchPendingRequests(); // Refresh pending requests
            })
            .catch(error => {
                setLoading(false);
                console.error("Error creating wallet!", error);
                toast.error(`Error: ${errorData.message}`);
                // alert('Error creating wallet');
            });
    };

    const fetchPendingRequests = () => {
        setLoading(true);
        fetch('https://a.khelogame.xyz/admin/pending-requests', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                setRequests(data);
            })
            .catch(error => {
                setLoading(false);
                console.error("Error fetching pending requests!", error);
            });
    };

    const handleRequest = (requestId, status) => {
        setLoading(true);
        fetch(`https://a.khelogame.xyz/admin/approve-request/${requestId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ status })
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                // alert(`Request ${status} successfully`);
                toast.success('Request ${status} successfully!');
                fetchPendingRequests();
            })
            .catch(error => {
                setLoading(false);
                console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} request!`, error);
                // alert(`Error ${status === 'approved' ? 'approving' : 'rejecting'} request`);
                toast.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} request`);
            });
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            <section className={styles.dashboard_main_box}>
                <h2>Add Wallet Coin</h2>
                <form onSubmit={handleSubmit} className={styles.agent_form_big_box}>
                    <select value={selectedAgent} onChange={handleAgentChange} required>
                        <option value="">Select Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                    </select>
                    {selectedAgent && (<>
                        <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} required>
                            <option value="">Select Property</option>
                            {properties.map(property => (
                                <option key={property.id} value={property.id}>{property.property_name}</option>
                            ))}
                        </select>
                    </>
                    )}
                    <input type="text" value={coins} onChange={e => setCoins(e.target.value)} placeholder='Add Coins' required />
                    <input type="submit" disabled={loading} value="Submit" />
                </form>

                <h2>Pending Requests</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className={styles.table_big_box}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Agent ID</th>
                                    <th>Property Name</th>
                                    <th>Requested Coins</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.agent_id}</td>
                                        <td>{request.property_name}</td>
                                        <td>{request.requested_coins}</td>
                                        <td>{request.status}</td>
                                        <td>
                                            <button onClick={() => handleRequest(request.id, 'approved')}>Approve</button>
                                            <button onClick={() => handleRequest(request.id, 'rejected')}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
};

export default AddWalletCoin;
