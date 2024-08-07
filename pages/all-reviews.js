import React, { useState, useEffect } from 'react';
import styles from "@/styles/AllReviews.module.css";
import Navbar from "@/components/Navbar";
import Link from 'next/link';


const AllReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin/all-reviews', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setReviews(data.reviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const updateReviewStatus = async (reviewId, status) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/admin/review/${reviewId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status }) 
            });

            if (!response.ok) {
                throw new Error(`HTTP error!: ${response.status}`);
            }

            setReviews(reviews.map(review =>
                review.review_id === reviewId ? { ...review, status } : review
            ));
        } catch (error) {
            console.error(`Error updating review:`, error);
        }
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        return review.status === filter;
    });

    

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>All Reviews</h2>
                <div className={styles.customer_filter_big_box}>
                    <div className={`${styles.switch_toggle} ${styles.switch_3} ${styles.switch_candy}`}>
                        <input 
                            id="all" 
                            name="state-d" 
                            type="radio" 
                            value="all" 
                            checked={filter === 'all'} 
                            onChange={handleFilterChange} 
                        />
                        <label htmlFor="all">All Reviews</label>
                        <input 
                            id="approved" 
                            name="state-d" 
                            type="radio" 
                            value="approved" 
                            checked={filter === 'approved'} 
                            onChange={handleFilterChange} 
                        />
                        <label htmlFor="approved">Approved</label>
                        <input 
                            id="rejected" 
                            name="state-d" 
                            type="radio" 
                            value="rejected" 
                            checked={filter === 'rejected'} 
                            onChange={handleFilterChange} 
                        />
                        <label htmlFor="rejected">Rejected</label>
                        <input 
                            id="pending" 
                            name="state-d" 
                            type="radio" 
                            value="pending" 
                            checked={filter === 'pending'} 
                            onChange={handleFilterChange} 
                        />
                        <label htmlFor="pending">Pending</label>
                    </div>
                </div>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>All Reviews</th>
                                <th>Property Detail</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.map(review => (
                                <tr key={review.review_id}>
                                    <td>
                                        <div className={styles.review_content_box}>
                                            <h4><img src="/images/contact-card.png" alt="" style={{ height: "40px" }} />{review.name}</h4>
                                           
                                               
                                                <p>{review.rating}</p>
                                            <p>{review.comment}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.property_name_box}>
                                            <Link href={`https://real-estate-gray-zeta.vercel.app/property?id=${review.property_id}`}>
                                                <h4>{review.property_name}</h4>
                                            </Link>
                                            <p>AED {review.price}</p>
                                        </div>
                                    </td>
                                    <td>{review.status}</td>
                                    <td>
                                        <div className={styles.action_btn_box}>
                                            <button className={styles.approve_btn} onClick={() => updateReviewStatus(review.review_id, 'approved')}>Approve</button>
                                            <button className={styles.reject_btn} onClick={() => updateReviewStatus(review.review_id, 'rejected')}>Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

export default AllReviews;
