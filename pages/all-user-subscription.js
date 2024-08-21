import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';

const UserSubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        const fetchUserPlans = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/all-user-subscriptions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch subscription plans');
                }
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setPlans(data.users || []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlans();
    }, []);

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>All User Subscription List</h2>
                {loading ? (
                    <p>Loading subscription plans...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className={styles.tableBigBox}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th>Purchased Plans</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan, index) => (
                                    <tr key={plan.user_id}>
                                        <td>{index + 1}</td>
                                        <td><b>{plan.subscription.plan_name}</b></td>
                                        <td>{plan.username}</td>
                                        <td>{plan.email}</td>
                                        <td>{plan.phone_number}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
};

export default UserSubscriptionPlans;
