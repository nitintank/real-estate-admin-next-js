import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';

const Purchasesubscriptionplan = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [newExpiryDate, setNewExpiryDate] = useState('');
    const [newPlanId, setNewPlanId] = useState('');

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
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/purchase/subscriptions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch subscriptions');
                }
                const data = await response.json();
                setSubscriptions(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchPlans = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/subscriptions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch subscription plans');
                }
                const data = await response.json();
                console.log('Plans Data:', data); // Log data for debugging
                setPlans(data.subscriptions || []);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSubscriptions();
        fetchPlans();
    }, []);

    const handleEditClick = (subscription) => {
        setEditingSubscription(subscription);
        setNewExpiryDate(subscription.expiry_date);
        setNewPlanId(subscription.subscription_id);
    };

    const handleUpdateSubscription = async () => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/admin/subscription/${editingSubscription.subscription_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    expiry_date: newExpiryDate,
                    subscription_id: newPlanId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update subscription');
            }

            // Update local state
            setSubscriptions(prevSubscriptions => prevSubscriptions.map(sub =>
                sub.subscription_id === editingSubscription.subscription_id
                    ? { ...sub, expiry_date: newExpiryDate, subscription_id: newPlanId }
                    : sub
            ));
            setEditingSubscription(null);
            setNewExpiryDate('');
            setNewPlanId('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Purchased Subscription Plans</h2>
                {loading ? (
                    <p>Loading subscription plans...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className={styles.tableBigBox}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Property Name</th>
                                    <th>Plan Name</th>
                                    <th>Price</th>
                                    <th>Coins</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Expiry Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map((subscription) => (
                                    <tr key={subscription.subscription_id}>
                                        <td>{subscription.user_name}</td>
                                        <td>{subscription.property_name || 'N/A'}</td>
                                        <td>{subscription.plan_name}</td>
                                        <td>{subscription.plan_price}</td>
                                        <td>{subscription.subscription_coins}</td>
                                        <td>{subscription.status}</td>
                                        <td>{new Date(subscription.created_at).toLocaleDateString()}</td>
                                        <td>{new Date(subscription.expiry_date).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(subscription)}>Edit</button>
                                            {editingSubscription?.subscription_id === subscription.subscription_id && (
                                                <div>
                                                    <label>
                                                        Expiry Date:
                                                        <input
                                                            type="date"
                                                            value={newExpiryDate}
                                                            onChange={(e) => setNewExpiryDate(e.target.value)}
                                                        />
                                                    </label>
                                                    <label>
                                                        Plan:
                                                        <select
                                                            value={newPlanId}
                                                            onChange={(e) => setNewPlanId(e.target.value)}
                                                        >
                                                            <option value="">Select Plan</option>
                                                            {plans.map(plan => (
                                                                <option key={plan.id} value={plan.id}>
                                                                    {plan.plan_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    <button onClick={handleUpdateSubscription}>Update</button>
                                                </div>
                                            )}
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

export default Purchasesubscriptionplan;
