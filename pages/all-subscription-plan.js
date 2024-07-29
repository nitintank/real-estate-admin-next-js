import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/subscriptions', {
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
                    setPlans(data.subscriptions || []);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleEditClick = async (subscriptionId) => {
        router.push(`/edit-subscription-plan/${subscriptionId}`);
    };



    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Manage Subscription Plans</h2>
                {loading ? (
                    <p>Loading subscription plans...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className={styles.tableBigBox}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>Plan Name</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan) => (
                                    <tr key={plan.id}>
                                        <td>{plan.plan_name}</td>
                                        <td>{plan.price}</td>
                                        <td>{plan.description}</td>
                                        <td>
                                            <i className='bx bxs-edit' onClick={() => handleEditClick(plan.id)}></i>
                                        </td>
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

export default SubscriptionPlans;
