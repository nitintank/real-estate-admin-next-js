import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/ProjectList.module.css";
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

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

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('https://a.khelogame.xyz/projects');
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                }
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Expected JSON response, but received non-JSON data');
                }
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDeleteClick = async (projectId) => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to delete project: ${response.status} ${response.statusText}`);
            }
            // Update projects state after successful deletion
            setProjects(projects.filter(project => project.project_id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
            // Handle error state if needed
        }
    };

    const handleEditClick = async (projectId) => {
        router.push(`/edit-project/${projectId}`);
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>All Project List</h2>
                <div className={styles.table_big_box}>
                    <table className={styles.customers}>
                        <thead>
                            <tr>
                            <th>Project Image</th>
                                <th>Project Name</th>
                                <th>Property Type</th>
                                <th>Location</th>
                                <th>Developer</th>
                              
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.project_id}>
                               
                                <td>
                                <Link href={`https://real-estate-gray-zeta.vercel.app/project-details?id=${project.project_id}`}>
                                        <Image
                                            width={100}
                                            height={100}
                                            src={project.image_paths ? `https://a.khelogame.xyz/property/${project.image_paths[0]}` : '/images/default-property.png'}
                                            alt={project.project_name}
                                            className={styles.preview_img}
                                        />
                                          </Link>
                                    </td>
                                <td>{project.project_name}</td>
                             
                                 
                                    <td>{project.property_type}</td>
                                    <td>{project.location}</td>
                                    <td>{project.developer_name}</td>

                                    <td>
                                        <div className={styles.action_box}>
                                            <i className="bx bx-edit" onClick={() => handleEditClick(project.project_id)}></i>
                                            <i className="bx bx-trash" onClick={() => handleDeleteClick(project.project_id)}></i>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default ProjectList