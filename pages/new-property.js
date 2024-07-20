import React, { useEffect, useState } from 'react';
import styles from "@/styles/NewProperty.module.css";
import Navbar from "@/components/Navbar";

const newProperty = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/new-properties', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                })
                if (!response.ok) {
                    throw new Error('Failed to fetch properties');
                }
                const data = await response.json();
                setProperties(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleStatusChange = async (propertyId, newStatus) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/admin/property/${propertyId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedProperty = await response.json();
            setProperties(prevProperties =>
                prevProperties.map(property =>
                    property.property_id === propertyId ? { ...property, status: newStatus } : property
                )
            );
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>New Property List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div className={styles.table_big_box}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Property Name</th>
                                    <th>Property Type</th>
                                    <th>Property Subtype</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property, index) => (
                                    <tr key={property.property_id}>
                                        <td>{index + 1}</td>
                                        <td>{property.username}</td>
                                        <td>{property.email}</td>
                                        <td>{property.phone_number}</td>
                                        <td>{property.property_name}</td>
                                        <td>{property.property_type}</td>
                                        <td>{property.property_subtype}</td>
                                        <td>{property.price}</td>
                                        <td>
                                            <select
                                                value={property.status}
                                                onChange={(e) => handleStatusChange(property.property_id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    )
}

export default newProperty