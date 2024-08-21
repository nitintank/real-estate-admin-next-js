import React, { useState, useEffect } from 'react';
import styles from "@/styles/AddAgent.module.css";
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAgent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        officePhoneNumber: '',
        address: '',
        description: '',
        experience: '',
        twitter: '',
        facebook: '',
        instagram: '',
        youtube: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Access values from formData
        const { name, email, phoneNumber, password, officePhoneNumber } = formData;

        if (!name) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'Email is required';
        if (!phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
        if (!password) newErrors.password = 'Password is required';
        if (!officePhoneNumber) newErrors.officePhoneNumber = 'Office phone number is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const form = new FormData();
        form.append('name', formData.name);
        form.append('email', formData.email);
        form.append('phone_number', formData.phoneNumber);
        form.append('password', formData.password);
        form.append('office_phone_number', formData.officePhoneNumber);
        form.append('address', formData.address);
        form.append('experience', formData.experience);
        form.append('description', formData.description);
        form.append('twitter', formData.twitter);
        form.append('facebook', formData.facebook);
        form.append('instagram', formData.instagram);
        form.append('youtube', formData.youtube);
        form.append('image', formData.image);

        try {
            const response = await fetch('https://a.khelogame.xyz/create-agent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: form
            });

            const result = await response.json();
            if (response.ok) {
                toast.success('Agent created successfully');
                console.log(result)
            } else {
                const errorData = await response.json();
                toast.error(`Error: ${errorData.message}`);
                console.error('Error:', errorData);
            }
        } catch (error) {

            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Add New Agent</h2>
                <form onSubmit={handleSubmit} className={styles.agent_form_big_box}>
                    <input type="text" placeholder="Add Agent Name" name="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className={styles.errorText}>{errors.name}</p>}
                    <input type="text" placeholder="Add Email Id" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                    <input type="text" placeholder="Add Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                    {errors.phoneNumber && <p className={styles.errorText}>{errors.phoneNumber}</p>}

                    <input type="text" placeholder="Add Password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                    <input type="text" placeholder="Add Office Phone Number" name="officePhoneNumber" value={formData.officePhoneNumber} onChange={handleChange} />
                    {errors.officePhoneNumber && <p className={styles.errorText}>{errors.officePhoneNumber}</p>}
                    <textarea id="" placeholder="Add Address" name="address" value={formData.address} onChange={handleChange}></textarea>
                    <textarea id="" placeholder="Add Description" name="description" value={formData.description} onChange={handleChange}></textarea>
                    <input type="text" placeholder="Add Experience" name="experience" value={formData.experience} onChange={handleChange} />
                    <input type="text" placeholder="Add Twitter Link" name="twitter" value={formData.twitter} onChange={handleChange} />
                    <input type="text" placeholder="Add Facebook Link" name="facebook" value={formData.facebook} onChange={handleChange} />
                    <input type="text" placeholder="Add Instagram Link" name="instagram" value={formData.instagram} onChange={handleChange} />
                    <input type="text" placeholder="Add Youtube Link" name="youtube" value={formData.youtube} onChange={handleChange} />
                    <label htmlFor="">Add Agent Profile Image</label>
                    <input type="file" name="image" onChange={handleChange} />
                    {imagePreview && <Image width={200} height={200} src={imagePreview} alt="Image Preview" style={{ marginTop: '10px', width: '200px', height: 'auto' }} />}
                    <input type="submit" value="Add Agent" />
                </form>
            </section>
        </>
    )
}

export default AddAgent