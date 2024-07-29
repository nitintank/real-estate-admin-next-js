import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Image from 'next/image';

const Agenttransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const router = useRouter();
    const { status } = router.query; // Extract status from query parameters

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
                                        <td><a href={transaction['10nc_document_contract']} target="_blank" rel="noopener noreferrer">View Document</a></td>
                                        <td><a href={transaction.owners_document} target="_blank" rel="noopener noreferrer">View Document</a></td>
                                        <td><a href={transaction.payment_cheques} target="_blank" rel="noopener noreferrer">View Cheques</a></td>
                                        <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                        <td>{transaction.status}</td>
                                        <td>
                                            <button 
                                                onClick={() => updateTransactionStatus(transaction.id, 'approved')} 
                                                disabled={updating}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => updateTransactionStatus(transaction.id, 'rejected')} 
                                                disabled={updating}
                                            >
                                                Reject
                                            </button>
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
