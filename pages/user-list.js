import React, { useEffect, useState } from 'react';
import styles from "@/styles/UserList.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Link from 'next/link';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewProperties, setViewProperties] = useState({});
    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('https://a.khelogame.xyz/admin/users', {
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
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    };

    const toggleViewProperties = (userId) => {
        setViewProperties(prevState => ({
            ...prevState,
            [userId]: !prevState[userId]
        }));
    };

    const handleStatusUpdate = (propertyId, newStatus) => {
        fetch(`https://a.khelogame.xyz/admin/property/${propertyId}/status`, {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>User List</h2>
                <div className={styles.customer_filter_big_box}>
                    <button><i className='bx bxs-plus-circle'></i> Add New Customer</button>
                    <div className={styles.search_customer_box}>
                        <input type="text" placeholder="Search Customer By Name" />
                        <i className='bx bx-search-alt'></i>
                    </div>
                </div>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <React.Fragment key={user.user_id}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone_number}</td>
                                        <td>
                                            <button onClick={() => toggleViewProperties(user.user_id)} className={styles.hide_view_btn}>
                                                {viewProperties[user.user_id] ? 'Hide' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                    {viewProperties[user.user_id] && (
                                        <tr>
                                            <td colSpan="5" className={styles.padding_0}>
                                                {user.properties.length > 0 ? (
                                                    <table className={styles.customers}>
                                                        <thead>
                                                            <tr>
                                                                <th>Property Name</th>
                                                                <th>Property Type</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {user.properties.map(property => (
                                                                <tr key={property.property_id}>
                                                                    <td>{property.property_name}</td>
                                                                    <td>{property.property_type}</td>
                                                                    <td>{property.status}</td>
                                                                    <td className={styles.button_mega_box}>
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(property.property_id, 'approved')}
                                                                            disabled={property.status === 'approved'}
                                                                            className={styles.approve_btn}
                                                                        >Approve</button>
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(property.property_id, 'rejected')}
                                                                            disabled={property.status === 'rejected'}
                                                                            className={styles.reject_btn}
                                                                        >Reject</button>
                                                                        {/* <Link href={`/admin-panel/admin-edit-property/${property.property_id}`} className={styles.edit_link_btn}><i class='bx bxs-edit'></i> Edit Property</Link> */}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <span>No properties</span>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default UserList