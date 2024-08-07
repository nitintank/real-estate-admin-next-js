import React, { useEffect, useState } from 'react';
import styles from "@/styles/UserList.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Image from 'next/image';
import ChangePasswordModal from '@/components/ChangePasswordModal'; // Import the new modal component

const AgentList = () => {
    const [agents, setAgents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewProperties, setViewProperties] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // For the selected user for password change
    const router = useRouter();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = () => {
        fetch('https://a.khelogame.xyz/admin/agent-properties', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response:', data);
                setAgents(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };


    const updatePropertyStatus = (propertyId, newStatus) => {
        fetch(`https://a.khelogame.xyz/admin/agent-property/${propertyId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Status Update Response:', data);
                setUsers(prevUsers =>
                    prevUsers.map(user => ({
                        ...user,
                        properties: user.properties.map(property =>
                            property.property_id === propertyId ? { ...property, status: newStatus } : property
                        )
                    }))
                );
            })
            .catch(error => {
                console.error('Error updating status:', error);
            });
    };

    const toggleViewProperties = (agentId) => {
        setViewProperties(prevState => ({
            ...prevState,
            [agentId]: !prevState[agentId]
        }));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePasswordChangeClick = (user) => {
        setSelectedUser(user);
    };

    const closePasswordChangeModal = () => {
        setSelectedUser(null);
    };

    const filteredAgents = Object.entries(agents).filter(([agentId, agent]) => {
        return (
            agent.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Agent Properties List</h2>
                <div className={styles.customer_filter_big_box}>
                    {/* <button><i className='bx bxs-plus-circle'></i> Add New Customer</button> */}
                    <div className={styles.search_customer_box}>
                        <input
                            type="text"
                            placeholder="Search Agent By Name"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <i className='bx bx-search-alt'></i>
                    </div>
                </div>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Agent Name</th>
                                <th>Agent Profile</th>
                                <th>Agent Phone Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAgents.map(([agentId, agent], index) => (
                                <React.Fragment key={agentId}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{agent.agent_name}</td>
                                        <td>
                                            {agent.agent_profile && (
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={`https://a.khelogame.xyz/${agent.agent_profile}`}
                                                    alt={agent.agent_name}
                                                    className={styles.agent_profile_img}
                                                />
                                            )}
                                        </td>
                                        <td>{agent.agent_phone_number}</td>
                                        <td>
                                            <button onClick={() => toggleViewProperties(agentId)} className={styles.hide_view_btn}>
                                                {viewProperties[agentId] ? 'Hide' : 'View'}
                                            </button>
                                            <button onClick={() => handlePasswordChangeClick(agent)} className={styles.change_password_btn}>
                                                Change Password
                                            </button>
                                        </td>
                                    </tr>
                                    {viewProperties[agentId] && (
                                        <tr>
                                            <td colSpan="5" className={styles.padding_0}>
                                                <table className={styles.customers}>
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Property Name</th>
                                                            <th>Property Type</th>
                                                            <th>Property Subtype</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {agent.properties.map((property, propIndex) => (
                                                            <tr key={property.property_id}>
                                                                <td>{propIndex + 1}</td>
                                                                <td>{property.property_name}</td>
                                                                <td>{property.property_type}</td>
                                                                <td>{property.property_subtype}</td>
                                                                <td>{property.status}</td>
                                                                <td>
                                                                    <button onClick={() => updatePropertyStatus(property.property_id, 'approved')} className={styles.status_btn}>
                                                                        Approve
                                                                    </button>
                                                                    <button onClick={() => updatePropertyStatus(property.property_id, 'rejected')} className={styles.status_btn}>
                                                                        Reject
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            {selectedUser && (
                <ChangePasswordModal
                    user={selectedUser}
                    onClose={closePasswordChangeModal}
                    userType={selectedUser.userType}
                />
            )}
        </>
    );
};

export default AgentList;
