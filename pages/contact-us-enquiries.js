import React, { useEffect, useState } from 'react';
import styles from "@/styles/ContactUsEnquiries.module.css";
import Navbar from "@/components/Navbar";

const ContactUsEnquiries = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/get-contact-us', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Contact Us Enquiries</h2>
                <div className={styles.table_big_box}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Message</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((message, index) => (
                                    <tr key={message.id}>
                                        <td>{index + 1}</td>
                                        <td>{message.name}</td>
                                        <td>{message.email}</td>
                                        <td>{message.phone_number}</td>
                                        <td>{message.message}</td>
                                        <td>{new Date(message.created_at).toLocaleString()}</td>
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

export default ContactUsEnquiries