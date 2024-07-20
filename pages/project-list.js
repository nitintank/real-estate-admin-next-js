import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar";
import styles from "@/styles/ProjectList.module.css";
import Image from 'next/image';

const projectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                                <th>Project Name</th>
                                <th>Property Type</th>
                                <th>Location</th>
                                <th>Developer</th>
                                <th>Project Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.project_id}>
                                    <td>{project.project_name}</td>
                                    <td>{project.property_type}</td>
                                    <td>{project.location}</td>
                                    <td>{project.developer_name}</td>
                                    <td>
                                        <Image
                                            width={100}
                                            height={100}
                                            src={project.image_paths ? `https://a.khelogame.xyz/property/${project.image_paths[0]}` : '/images/default-property.png'}
                                            alt={project.project_name}
                                            className={styles.preview_img}
                                        />
                                    </td>
                                    <td>
                                        {/* <Link href={`/admin-panel/admin-edit-project/${project.project_id}`}>
                                            <i class='bx bx-edit'></i>
                                        </Link> */}
                                        <i className="bx bx-trash" onClick={() => handleDeleteClick(project.project_id)}></i>
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

export default projectList