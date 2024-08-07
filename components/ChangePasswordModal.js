import React, { useState } from 'react';
import styles from "@/styles/ChangePasswordModal.module.css";

const ChangePasswordModal = ({ user, onClose, userType }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setError('Password and confirm password do not match');
            return;
        }

        fetch('https://a.khelogame.xyz/admin-change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                user_type: userType,
                user_id: userType === 'user' ? user.user_id : null,
                agent_id: userType === 'agent' ? user.id : null,
                new_password: newPassword,
                confirm_password: confirmPassword
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Password Change Response:', data);
            onClose();
        })
        .catch(error => {
            console.error('Error changing password:', error);
            setError('Failed to change password');
        });
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>Change Password for {user.username}</h2>
                <div className={styles.formGroup}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button onClick={handleChangePassword} className={styles.submitBtn}>Change Password</button>
            </div>
        </div>
    );
};

export default ChangePasswordModal;

