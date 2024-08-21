import React, { useEffect, useState } from 'react';
import styles from "@/styles/PropertyPageEnquiry.module.css";
import Navbar from "@/components/Navbar";
import Link from 'next/link';

const PropertyPageEnquiry = () => {
    const [inquiries, setInquiries] = useState([]);

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
                                <th>Property Owner Name</th>
                                <th>Property Name</th>
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
                                    <td>{inquiry.user_name}</td>
                                    <td><Link href={`https://real-estate-gray-zeta.vercel.app/property?id=${inquiry.property_id}`}>{inquiry.property_name}</Link></td>
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

export default PropertyPageEnquiry