import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";

const TranstionHistory = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactionHistory, setTransactionHistory] = useState([]);

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
        const fetchTransactionHistory = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/transaction-history', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transaction history');
                }

                const data = await response.json();
                setTransactionHistory(data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching transaction history');
                setLoading(false);
            }
        };

        fetchTransactionHistory();
    }, []);

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>All Transaction History</h2>
                {loading ? (
                    <p>Loading Transaction History...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className={styles.tableBigBox}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Username</th>
                                    <th>Total Subscription Coins</th>
                                    <th>Property Name</th>
                                    <th>Plan Name</th>
                                    <th>Subscription Coins</th>
                                    <th>Plan Price</th>
                                    <th>Boost Coins</th>
                                    <th>Subscription Created At</th>
                                    <th>Subscription Expiry Date</th>
                                    <th>Boost Expiry Date</th>
                                    <th>Boost Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(transactionHistory) && transactionHistory.length > 0 ? (
                                    transactionHistory.map((transaction, index) => (
                                        <tr key={index}>
                                            <td>{transaction.user_id}</td>
                                            <td>{transaction.user_name}</td>
                                            <td>{transaction.total_subscription_coins}</td>
                                            <td>{transaction.property_name}</td>
                                            <td>{transaction.plan_name}</td>
                                            <td>{transaction.subscription_coins}</td>
                                            <td>{transaction.plan_price}</td>
                                            <td>{transaction.boost_coins}</td>
                                            <td>{new Date(transaction.subscription_created_at).toLocaleDateString()}</td>
                                            <td>{new Date(transaction.subscription_expiry_date).toLocaleDateString()}</td>
                                            <td>{new Date(transaction.property_boost_expiry_date).toLocaleDateString()}</td>
                                            <td>{new Date(transaction.property_boost_created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">No transaction history available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
};

export default TranstionHistory;
