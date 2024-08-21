import React, { useEffect, useState } from 'react';
import styles from "@/styles/UserList.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import ChangePasswordModal from '@/components/ChangePasswordModal'; // Import the new modal component

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewProperties, setViewProperties] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // For the selected user for password change
    const router = useRouter();

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // const handlePasswordChangeClick = (user) => {
    //     setSelectedUser(user);
    // };
    const handlePasswordChangeClick = (user) => {
        setSelectedUser({
            ...user,
            userType: 'user' // or 'agent' based on your context
        });
    };

    const closePasswordChangeModal = () => {
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone_number.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className={styles.customer_filter_big_box}>
                    <h2>User List</h2>
                    <div className={styles.search_customer_box}>
                        <input
                            type="text"
                            placeholder="Search By Name, Email, Phone Number"
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <React.Fragment key={user.user_id}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone_number}</td>
                                        <td>
                                            <div className={styles.button_box}>
                                                <button onClick={() => toggleViewProperties(user.user_id)} className={styles.hide_view_btn}>
                                                    {viewProperties[user.user_id] ? 'Hide' : 'View'}
                                                </button>
                                                <button onClick={() => handlePasswordChangeClick(user)} className={styles.change_password_btn}>
                                                    Change Password
                                                </button>
                                            </div>
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

export default UserList;
