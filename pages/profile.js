import React, { useEffect, useState } from 'react';
import styles from "@/styles/Profile.module.css";
import Navbar from "@/components/Navbar";

const Profile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [profileSuccessMessage, setProfileSuccessMessage] = useState('');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('https://a.khelogame.xyz/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const profileData = await response.json();
            setUsername(profileData.username);
            setEmail(profileData.email);
            setPhoneNumber(profileData.phone_number);
        } catch (error) {
            console.error('Error fetching profile data:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setError('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password must match');
            return;
        }

        try {
            const response = await fetch('https://a.khelogame.xyz/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to change password');
            } else {
                setSuccessMessage(data.message);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setError('Failed to change password');
        }
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://a.khelogame.xyz/edit-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    username,
                    email,
                    phone_number
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            const responseData = await response.json();
            setProfileSuccessMessage(responseData.message);
            console.log('Profile updated successfully:', responseData);
            // Optionally, show success message or redirect to another page
        } catch (error) {
            console.error('Error updating profile:', error.message);
            // Handle error as needed (show error message to user, retry logic, etc.)
        }
    };

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <div className={styles.mainContentBox}>
                    <div className={styles.userProfileBox}>
                        <h2>User Profile</h2>
                        <form onSubmit={handleProfileSubmit}>
                            <div className={styles.formInnerBox1}>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)}
                                    readOnly />
                            </div>
                            <div className={styles.formInnerBox1}>
                                <button type="submit">Update <i class='bx bxs-right-arrow-circle'></i></button>
                            </div>
                            {profileSuccessMessage && <p className={styles.success}>{profileSuccessMessage}</p>}
                        </form>
                    </div>

                    <div className={styles.userProfileBox}>
                        <h2>Change Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formInnerBox1}>
                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password*" />
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password*"
                                />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password*" />
                            </div>
                            <div className={styles.formInnerBox1}>
                                <button type="submit">Update <i class='bx bxs-right-arrow-circle'></i></button>
                            </div>
                        </form>
                        {error && <p className={styles.error}>{error}</p>}
                        {successMessage && <p className={styles.success}>{successMessage}</p>}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Profile