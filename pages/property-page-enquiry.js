import React, { useEffect, useState } from 'react';
import styles from "@/styles/PropertyPageEnquiry.module.css";
import Navbar from "@/components/Navbar";

const propertyPageEnquiry = () => {
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        fetch('https://a.khelogame.xyz/inquiries', {
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
                console.log(data); // Make sure you're receiving data correctly
                setInquiries(data.inquiries || []);
            })
            .catch(error => {
                console.error('Error fetching inquiries:', error);
                // Handle error state or redirect as needed
            });
    }, []);

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Property Page Enquiries</h2>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>S No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Agent Type</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry, index) => (
                                <tr key={inquiry.id}>
                                    <td>{index + 1}</td>
                                    <td>{inquiry.name}</td>
                                    <td>{inquiry.email}</td>
                                    <td>{inquiry.phone_number}</td>
                                    <td>{inquiry.agent_type}</td>
                                    <td>{inquiry.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default propertyPageEnquiry