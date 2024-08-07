import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageWebsiteNumber = () => {
    const [supportcontact, setSupportcontact] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const router = useRouter();

    const [formData, setFormData] = useState({
        help_contact_number: '',
        support_contact_number: '',
        emergency_contact_number: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // const validateForm = () => {
    //     const newErrors = {};
    //     const { help_contact_number, support_contact_number, emergency_contact_number } = formData;
    
    //     if (!help_contact_number) newErrors.help_contact_number = 'Help Contact Number is required';
    //     if (!support_contact_number) newErrors.support_contact_number = 'Support Contact Number is required';
    //     if (!emergency_contact_number) newErrors.emergency_contact_number = 'Emergency Contact Number is required';
    
    //     setError(newErrors);
    
    //     return Object.keys(newErrors).length === 0;
    // };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (!validateForm()) return;
        
        try {
            const response = await fetch('https://a.khelogame.xyz/admin_support_contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    help_contact_number: formData.help_contact_number,
                    support_contact_number: formData.support_contact_number,
                    emergency_contact_number: formData.emergency_contact_number
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save agent contact information');
            }

            // Handle success, maybe show a success message or redirect
            console.log('Agent contact information saved successfully');
            toast.success('Support Number added successfully!');
        } catch (error) {
            console.error('Error saving agent contact information:', error.message);
            toast.error(`Error: ${errorData.message}`);
            // Handle error, maybe show an error message
        }
    };

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/admin_support_contact');
                if (!response.ok) {
                    throw new Error('Failed to fetch agents');
                }
                const data = await response.json();
                setSupportcontact(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const handleEditClick = async (supportId) => {
        router.push(`/edit-website-number/${supportId}`);
    };

    const handleDeleteClick = async (supportId) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/admin_support_contact/${supportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                setSupportcontact(supportcontact.filter(support => support.id !== supportId));
                console.log('Contact deleted successfully');
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Manage Website Number</h2>
                <form onSubmit={handleSubmit} className={styles.website_form_big_box}>
                    <input type="text" placeholder="Help Contact Number" name="help_contact_number" value={formData.help_contact_number}
                            onChange={handleChange} />
                    {/* {error.help_contact_number && <p className={styles.errorText}>{error.help_contact_number}</p>}            */}
                    <input type="text" placeholder="Support Contact Number" name="support_contact_number" value={formData.support_contact_number} onChange={handleChange} />
                    {/* {error.support_contact_number && <p className={styles.errorText}>{error.support_contact_number}</p>}     */}
                    <input type="text" placeholder="Emergency Contact Number" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleChange} />
                    {/* {error.emergency_contact_number && <p className={styles.errorText}>{error.emergency_contact_number}</p>}     */}
                    <input type="submit" value="Save" />
                </form>
                <div className={styles.tableBigBox}>
                {loading ? (
                            <p>Loading agents...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                                <th>Help Contact Number</th>
                                <th>Support Contact Number</th>
                                <th>Emergency Contact Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {supportcontact.map((support) => (
                            <tr key={support.id}>
                                <td>{support.help_contact_number}</td>
                                <td>{support.support_contact_number}</td>
                                <td>{support.emergency_contact_number}</td>
                                <td>
                                    <i className='bx bxs-edit' onClick={() => handleEditClick(support.id)}></i>
                                    <i className='bx bx-trash' onClick={() => handleDeleteClick(support.id)}></i>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </section>
        </>
    )
}

export default ManageWebsiteNumber