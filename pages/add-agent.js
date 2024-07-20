import React, { useState } from 'react';
import styles from "@/styles/AddAgent.module.css";
import Navbar from "@/components/Navbar";

const addAgent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        officePhoneNumber: '',
        address: '',
        description: '',
        experience: '',
        twitter:'',
        facebook:'',
        instagram:'',
        youtube:'',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                alert('Agent created successfully');
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Add New Agent</h2>
                <form onSubmit={handleSubmit} className={styles.agent_form_big_box}>
                    <input type="text" placeholder="Add Agent Name" name="name" value={formData.name} onChange={handleChange} />
                    <input type="text" placeholder="Add Email Id" name="email" value={formData.email} onChange={handleChange} />
                    <input type="text" placeholder="Add Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}/>
                    <input type="text" placeholder="Add Password" name="password" value={formData.password} onChange={handleChange}/>
                    <input type="text" placeholder="Add Office Phone Number" name="officePhoneNumber" value={formData.officePhoneNumber} onChange={handleChange} />
                    <textarea id="" placeholder="Add Address" name="address" value={formData.address} onChange={handleChange}></textarea>
                    <textarea id="" placeholder="Add Description" name="description" value={formData.description} onChange={handleChange}></textarea>
                    <input type="text" placeholder="Add Experience" name="experience" value={formData.experience} onChange={handleChange} />
                    <input type="text" placeholder="Add Twitter Link" name="twitter" value={formData.twitter} onChange={handleChange} />
                    <input type="text" placeholder="Add Facebook Link" name="facebook" value={formData.facebook} onChange={handleChange} />
                    <input type="text" placeholder="Add Instagram Link" name="instagram" value={formData.instagram} onChange={handleChange} />
                    <input type="text" placeholder="Add Youtube Link" name="youtube" value={formData.youtube} onChange={handleChange} />
                    <label htmlFor="">Add Agent Profile Image</label>
                    <input type="file" name="image" onChange={handleChange} />
                    {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ marginTop: '10px', width: '200px', height: 'auto' }} />}
                    <input type="submit" value="Add Agent" />
                </form>
            </section>
        </>
    )
}

export default addAgent