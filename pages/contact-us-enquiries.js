import React, { useEffect, useState } from 'react';
import styles from "@/styles/ContactUsEnquiries.module.css";
import Navbar from "@/components/Navbar";

const ContactUsEnquiries = () => {
    const [messages, setMessages] = useState([]);
    const [harmonyEnquiry, setHarmonyEnquiry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSection, setSelectedSection] = useState('contactUs');

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

        const fetchMessages2 = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/get-all-contact-us', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHarmonyEnquiry(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        fetchMessages2();
    }, []);

    const handleSectionChange = (event) => {
        setSelectedSection(event.target.value);
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <div className={styles.radioInput}>
                    <label>
                        <input
                            value="contactUs"
                            name="value-radio"
                            type="radio"
                            checked={selectedSection === 'contactUs'}
                            onChange={handleSectionChange}
                        />
                        <span>Contact Us</span>
                    </label>
                    <label>
                        <input
                            value="harmonySite"
                            name="value-radio"
                            type="radio"
                            checked={selectedSection === 'harmonySite'}
                            onChange={handleSectionChange}
                        />
                        <span>Harmony Site</span>
                    </label>
                    <span className={styles.selection}></span>
                </div>

                {selectedSection === 'contactUs' && (
                    <>
                        <h2>Contact Us Enquiries</h2>
                        <div className={styles.table_big_box} id="contact-enquriy">
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
                    </>
                )}

                {selectedSection === 'harmonySite' && (
                    <>
                        <h2>Harmony New Site Enquiries</h2>
                        <div className={styles.table_big_box} id="harmony-enquriy">
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
                                            <th>Message</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {harmonyEnquiry.map((message, index) => (
                                            <tr key={message.id}>
                                                <td>{index + 1}</td>
                                                <td>{message.name}</td>
                                                <td>{message.email}</td>
                                                <td>{message.message}</td>
                                                <td>{new Date(message.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}
            </section>
        </>
    );
};

export default ContactUsEnquiries;