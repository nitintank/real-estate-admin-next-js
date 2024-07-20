import React, { useEffect, useState } from 'react';
import styles from "@/styles/AllAgents.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

const AllAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/all_agents');
                if (!response.ok) {
                    throw new Error('Failed to fetch agents');
                }
                const data = await response.json();
                setAgents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const handleEditClick = async (agentId) => {
        router.push(`/admin-panel/admin-edit-agent/${agentId}`);
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>All Agents List</h2>
                <div className={styles.customer_filter_big_box}>
                    <div className={styles.search_customer_box}>
                        <input type="text" placeholder="Search Agent By Name" />
                        <i className='bx bx-search-alt'></i>
                    </div>
                    <Link href='/add-agent'><button><i className='bx bxs-plus-circle'></i> Add New Agent</button></Link>
                </div>
                <div className={styles.table_big_box}>
                    {loading ? (
                        <p>Loading agents...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Profile Image</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Address</th>
                                    <th>Office Phone No.</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map((agent) => (
                                    <tr key={agent.id}>
                                        <td>{agent.id}</td>
                                        <td>{agent.name}</td>
                                        <td>
                                            {agent.image_path && (
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={agent.image_path ? `https://a.khelogame.xyz/${agent.image_path}` : '/images/default-property.png'}
                                                    alt={agent.name}
                                                    className={styles.agent_profile_img}
                                                />
                                            )}
                                        </td>
                                        <td>{agent.email}</td>
                                        <td>{agent.phone_number}</td>
                                        <td>{agent.address}</td>
                                        <td>{agent.office_phone_number}</td>
                                        <td>{new Date(agent.created_at).toLocaleDateString()}</td>
                                        <td>{agent.is_suspended ? 'Suspended' : 'Active'}</td>
                                        <td>
                                            <i className='bx bx-edit' onClick={() => handleEditClick(agent.id)}></i>
                                            <i className='bx bx-trash' onClick={() => handleDeleteClick(agent.id)}></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </>
    )
}

export default AllAgents