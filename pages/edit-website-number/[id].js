import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';

const EditContactSupport = () => {
    const router = useRouter();
    const { id } = router.query;
    const [contactsupportId, setContactsupportId] = useState('');
    const [help_contact_number, setHelpcontactnumber] = useState('');
    const [support_contact_number, setSupportcontactnumber] = useState('');
    const [emergency_contact_number, setEmergencycontactnumber] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            setContactsupportId(id);
            fetchProfileData(id);
        }
    }, [id]);

    const fetchProfileData = async (id) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/admin_support_contact/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch contact support data');
            }
            const contactData = await response.json();
            setHelpcontactnumber(contactData.help_contact_number);
            setSupportcontactnumber(contactData.support_contact_number);
            setEmergencycontactnumber(contactData.emergency_contact_number);
        } catch (error) {
            console.error('Error fetching contact support data:', error.message);
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            help_contact_number,
            support_contact_number,
            emergency_contact_number
        };

        try {
            const response = await fetch(`https://a.khelogame.xyz/admin_support_contact/${contactsupportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update contact support');
            }
            router.push('/manage-website-number');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Edit Website Number</h2>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.website_form_big_box}>
                    <input type="text" placeholder="Help Contact Number" value={help_contact_number}
                        onChange={(e) => setHelpcontactnumber(e.target.value)} />
                    <input type="text" placeholder="Support Contact Number" value={support_contact_number}
                        onChange={(e) => setSupportcontactnumber(e.target.value)} />
                    <input type="text" placeholder="Emergency Contact Number" value={emergency_contact_number}
                        onChange={(e) => setEmergencycontactnumber(e.target.value)} />
                    <input type="submit" value="Update Contact Support" />
                </form>
            </section>
        </>
    )
}

export default EditContactSupport