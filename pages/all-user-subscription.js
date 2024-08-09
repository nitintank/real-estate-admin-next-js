import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';

const UserSubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

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
                                {plans.map((plan,index) => (
                                    <tr key={plan.user_id}>
                                        <td>{index+1}</td>
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
