import React, { useEffect, useState } from 'react';
import styles from "@/styles/ManageWebsiteNumber.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const EditAgent = () => {
    const router = useRouter();
    const [agentId, setAgentId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [officePhoneNumber, setOfficePhoneNumber] = useState('');
    const [description, setDescription] = useState('');
    const [experience, setExperience] = useState('');
    const [twitter, setTwitter] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [youtube, setYoutube] = useState('');
    const [imagePath, setImagePath] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (router.query.id) {
            setAgentId(router.query.id);
        }
    }, [router.query.id]);

    useEffect(() => {
        if (agentId) {
            fetchProfileData();
        }
    }, [agentId]);

    const fetchProfileData = async () => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/agents/${agentId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const profileData = await response.json();
            setUsername(profileData.name);
            setEmail(profileData.email);
            setPhoneNumber(profileData.phone_number);
            setAddress(profileData.address);
            setOfficePhoneNumber(profileData.office_phone_number);
            setDescription(profileData.description);
            setExperience(profileData.experience);
            setTwitter(profileData.twitter);
            setFacebook(profileData.facebook);
            setInstagram(profileData.instagram);
            setYoutube(profileData.youtube);
            setImagePath(profileData.image_path);
        } catch (error) {
            console.error('Error fetching profile data:', error.message);
            setError(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', username);
        formData.append('email', email);
        formData.append('phone_number', phoneNumber);
        formData.append('address', address);
        formData.append('office_phone_number', officePhoneNumber);
        formData.append('description', description);
        formData.append('experience', experience);
        formData.append('twitter', twitter);
        formData.append('facebook', facebook);
        formData.append('instagram', instagram);
        formData.append('youtube', youtube);
        if (imagePath instanceof File) {
            formData.append('image', imagePath);
        }

        try {
            const response = await fetch(`https://a.khelogame.xyz/update-agent/${agentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update agent');
            }
            router.push('/all-agents');
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
                <input
                            type="text"
                            name="name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <label>Office Phone Number</label>
                        <input
                            type="text"
                            name="office_phone_number"
                            value={officePhoneNumber}
                            onChange={(e) => setOfficePhoneNumber(e.target.value)}
                        />
                        <label>Description</label>
                        <br></br>

                         <textarea
                            name="description"
                            rows="10"
                            cols="90"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                         <br/>
                        <label>Experience</label>
                         <input
                            type="text"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        />
                        <label>Twitter</label>
                        <input
                            type="text"
                            name="twitter"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                        />
                        <label>Facebook</label>
                        <input
                            type="text"
                            name="facebook"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                        />
                        <label>Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                        />
                        <label>Youtube</label>
                        <input
                            type="text"
                            name="youtube"
                            value={youtube}
                            onChange={(e) => setYoutube(e.target.value)}
                        />
                        <label>Update Profile Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={(e) => setImagePath(e.target.files[0])}
                        />
                        {imagePath && typeof imagePath === 'string' && (
                            <Image
                                src={`https://a.khelogame.xyz/${imagePath}`}
                                alt="Profile Image"
                                width={200}
                                height={200}
                            />
                        )}
                        
                        <button type="submit" className={styles.submit_btn_css}><i class='bx bxs-add-to-queue'></i> Update Agent</button>
                </form>
            </section>
        </>
    )
}

export default EditAgent