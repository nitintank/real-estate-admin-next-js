import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css"; 
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';

const EditSubscription = () => {
    const router = useRouter();
    const { id } = router.query;
    const [subscription, setSubscription] = useState({
        plan_name: '',
        price: '',
        description: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchSubscriptionData(id);
        }
    }, [id]);

    const fetchSubscriptionData = async (subscriptionId) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/subscription/${subscriptionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch subscription data');
            }
            const data = await response.json();
            setSubscription(data.subscription);
        } catch (error) {
            console.error('Error fetching subscription data:', error.message);
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            plan_name: subscription.plan_name,
            price: subscription.price,
            description: subscription.description
        };

        try {
            const response = await fetch(`https://a.khelogame.xyz/subscription/edit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update subscription');
            }
            router.push('/all-subscription-plan'); // Redirect to the subscription management page or any other page
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Edit Subscription</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.website_form_big_box}>
                    <input 
                        type="text" 
                        placeholder="Plan Name" 
                        value={subscription.plan_name}
                        onChange={(e) => setSubscription(prev => ({ ...prev, plan_name: e.target.value }))} 
                    />
                    <input 
                        type="number" 
                        placeholder="Price" 
                        value={subscription.price}
                        onChange={(e) => setSubscription(prev => ({ ...prev, price: e.target.value }))} 
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={subscription.description}
                        onChange={(e) => setSubscription(prev => ({ ...prev, description: e.target.value }))} 
                    />
                    <input type="submit" value="Update Subscription" />
                </form>
            </section>
        </>
    );
}

export default EditSubscription;
