import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

const Agenttransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const router = useRouter();
    const { status } = router.query; // Extract status from query parameters

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
        const fetchAgentTransactions = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/agent-transactions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch agent transactions');
                }
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setTransactions(data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentTransactions();
    }, []);

    useEffect(() => {
        // Filter transactions based on the status from query parameters
        if (status) {
            setFilteredTransactions(transactions.filter(transaction => transaction.status === status));
        } else {
            setFilteredTransactions(transactions);
        }
    }, [transactions, status]);

    const updateTransactionStatus = async (transactionId, newStatus) => {
        setUpdating(true);
        setUpdateError(null);
        try {
            const response = await fetch(`https://a.khelogame.xyz/admin/agent-transaction/${transactionId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) {
                throw new Error('Failed to update transaction status');
            }
            const updatedTransaction = await response.json();
            setTransactions(transactions.map(t => t.id === transactionId ? { ...t, status: newStatus } : t));
        } catch (err) {
            setUpdateError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Agent Transactions</h2>
                {loading ? (
                    <p>Loading transactions...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className={styles.tableBigBox}>
                        <table className={styles.customers}>
                            <thead>
                                <tr>
                                    <th>S No.</th>
                                    <th>Agent Name</th>
                                    <th>Agent Profile</th>
                                    <th>Property Detail</th>
                                    <th>10nc Document Contract</th>
                                    <th>Owners Document</th>
                                    <th>Payment Cheques</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((transaction, index) => (
                                    <tr key={transaction.id}>
                                        <td>{index + 1}</td>
                                        <td>{transaction.name}</td>
                                        <td>
                                            <Image
                                                width={100}
                                                height={100}
                                                src={`https://a.khelogame.xyz/${transaction.image_path}`}
                                                alt={transaction.name}
                                                className={styles.agent_profile_img}
                                            />
                                        </td>
                                        <td>{transaction.property_detail}</td>
                                        <td>
                                            <Link className={styles.docunment_box} href={`https://a.khelogame.xyz/${transaction.tnc_document_contract}`} target="_blank" rel="noopener noreferrer">
                                                View Document
                                            </Link>
                                        </td>
                                        <td>
                                            <Link className={styles.docunment_box} href={`https://a.khelogame.xyz/${transaction.owners_document}`} target="_blank" rel="noopener noreferrer">
                                                View Document
                                            </Link>
                                        </td>
                                        <td>
                                            <Link className={styles.docunment_box} href={`https://a.khelogame.xyz/${transaction.payment_cheques}`} target="_blank" rel="noopener noreferrer">
                                                View Cheque
                                            </Link>
                                        </td>
                                        <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                        <td>{transaction.status}</td>
                                        <td>
                                            <div className={styles.action_box}>
                                                <button onClick={() => updateTransactionStatus(transaction.id, 'approved')}
                                                    disabled={updating} className={styles.completed_btn}>Approve</button>
                                                <button onClick={() => updateTransactionStatus(transaction.id, 'rejected')}
                                                    disabled={updating} className={styles.reject_btn}>Reject</button>
                                            </div>
                                            {updateError && <p>{updateError}</p>}
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

export default Agenttransactions;