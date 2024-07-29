import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from "@/styles/AgentPageEnquiry.module.css";
import Navbar from "@/components/Navbar";

const AgentPageEnquiry = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/agent-inquiries', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setInquiries(data.inquiries);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Agent Page Enquiries</h2>
                <div className={styles.table_big_box}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th>Agent Name</th>
                                    <th>Agent Profile</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Message</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map((inquiry, index) => (
                                    <tr key={inquiry.id}>
                                        <td>{index + 1}</td>
                                        <td>{inquiry.agent_name}</td>
                                        <td>
                                            {inquiry.agent_image_path && (
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    src={inquiry.agent_image_path ? `https://a.khelogame.xyz/${inquiry.agent_image_path}` : '/images/default-property.png'}
                                                    alt={inquiry.agent_name}
                                                    className={styles.agent_profile_img}
                                                />
                                            )}
                                        </td>
                                        <td>{inquiry.name}</td>
                                        <td>{inquiry.email}</td>
                                        <td>{inquiry.phone}</td>
                                        <td>{inquiry.message}</td>
                                        <td>{inquiry.created_at}</td>
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

export default AgentPageEnquiry;
