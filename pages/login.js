import React, { useState } from 'react'
import styles from "@/styles/Login.module.css";
import Image from 'next/image';

const Login = () => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [invalidLogin, setInvalidLogin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        if (e.target.name === 'identifier') {
            setIdentifier(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = { identifier, password }
        let res = await fetch('https://a.khelogame.xyz/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        let response = await res.json()
        if (response.error == "User not found or invalid credentials") {
            setInvalidLogin(true)
        }
        else if (response.role == "admin") {
            localStorage.setItem('email', response.email);
            localStorage.setItem('accessToken', response.access_token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('role', response.role);
            localStorage.setItem('userId', response.id);

            location.href = "/"
        }

    }

    return (
        <>
            <div className={styles.body}>
                <div className={styles.wrapper}>
                    <form method='POST' onSubmit={handleSubmit} className={styles.form}>
                        <h2>Admin Login</h2>
                        <div className={styles.input_field}>
                            <input type="text" placeholder="Enter Email or Phone No." name='identifier' value={identifier} onChange={handleChange} required />
                            <label htmlFor="identifier">Enter Email or Phone No.</label>
                        </div>
                        <div className={styles.input_field}>
                            <input type="type" placeholder="Enter Password" name='password' value={password} onChange={handleChange} required />
                            <label htmlFor="password">Enter Password</label>
                        </div>
                        <button type="submit">Login</button>
                        {invalidLogin && <p className={styles.redText}>Invalid Credentials, Try Again</p>}
                    </form>
                </div>
                <div className={styles.wrapper_2}>
                    <Image src="/images/prop-agent-img.png" width={200} height={200} alt='' />
                </div>
            </div>
        </>
    )
}

export default Login