import React, { useState, useEffect } from 'react';
import styles from "@/styles/AddProject.module.css";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/router';
import Image from 'next/image';

const EditProject = () => {
    const router = useRouter();
    const { projectId } = router.query;
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const [floorPlanPreviews, setFloorPlanPreviews] = useState([]);

    const [developerName, setDeveloperName] = useState('');
    const [location, setLocation] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [announcementDate, setAnnouncementDate] = useState('');
    const [constructionStartDate, setConstructionStartDate] = useState('');
    const [expectedCompletionDate, setExpectedCompletionDate] = useState('');
    const [city, setCity] = useState('');
    const [locality, setLocality] = useState('');
    const [landZone, setLandZone] = useState('');
    const [bedroom, setBedroom] = useState('');
    const [washroom, setWashroom] = useState('');
    const [area, setArea] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [numberOfBuildings, setNumberOfBuildings] = useState(1);
    const [buildings, setBuildings] = useState([
        { name: '', floors: [{ floor_name: '', bedrooms: '', area: '', floor_price: '', floorPlan: null }] }
    ]);
    const [amenities, setAmenities] = useState({
        recreationAndFamily: [],
        healthAndFitness: [],
        features: [],
        cleaningAndMaintenance: []
    });

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
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            videoPreviews.forEach(url => URL.revokeObjectURL(url));
            floorPlanPreviews.flat().forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviews, videoPreviews, floorPlanPreviews]);


    const fetchProjectData = async () => {
        try {
            const response = await fetch(`https://a.khelogame.xyz/project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setProjectData(data);

            // Utility function to safely format dates
            const formatDate = (dateStr) => {
                if (dateStr) {
                    const date = new Date(dateStr);
                    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
                }
                return '';
            };

            // Set form fields with fetched data
            setProjectName(data.project.project_name || '');
            setDescription(data.project.description || '');
            setPrice(data.project.price || '');
            setDeveloperName(data.project.developer_name || '');
            setLocation(data.project.location || '');
            setDeliveryDate(formatDate(data.project.delivery_date));
            setAnnouncementDate(formatDate(data.project.announcement_date));
            setConstructionStartDate(formatDate(data.project.construction_start_date));
            setExpectedCompletionDate(formatDate(data.project.expected_completion_date));
            setCity(data.project.city || '');
            setLocality(data.project.locality || '');
            setLandZone(data.project.land_zone || '');
            setBedroom(data.project.bedroom || '');
            setWashroom(data.project.washroom || '');
            setArea(data.project.area || '');
            setPropertyType(data.project.property_type || '');
            setNumberOfBuildings((data.buildings || []).length);


            setBuildings((data.buildings || []).map(building => ({
                name: building.building_name,
                floors: (building.floors || []).map(floor => ({
                    ...floor,
                    floorPlan: floor.floor_plan_image ? { name: floor.floor_plan_image } : null
                }))
            })));

            setAmenities(data.amenities || {});
        } catch (error) {
            console.error('Error fetching project data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            property_type: propertyType,
            amenities: {
                cleaningAndMaintenance: amenities.cleaningAndMaintenance,
                features: amenities.features,
                healthAndFitness: amenities.healthAndFitness,
                recreationAndFamily: amenities.recreationAndFamily
            },
            announcement_date: new Date(announcementDate).toISOString(),
            area: area,
            bedroom: bedroom,
            building_names: buildings.reduce((acc, building) => {
                acc[building.name] = building.floors.map(floor => ({
                    floor_name: floor.floor_name,
                    floor_area: floor.area,
                    floor_bedrooms: floor.bedrooms,
                    floor_price: floor.floor_price,
                    floor_plan_image: floor.floorPlan ? floor.floorPlan.name : null
                }));
                return acc;
            }, {}),
            city: city,
            construction_start_date: new Date(constructionStartDate).toISOString(),
            delivery_date: new Date(deliveryDate).toISOString(),
            description: description,
            developer_name: developerName,
            expected_completion_date: new Date(expectedCompletionDate).toISOString(),
            image_paths: images.map(file => file.name),
            land_zone: landZone,
            locality: locality,
            location: location,
            price: price,
            project_name: projectName,
            video_paths: videos.map(file => file.name),
            washroom: washroom
        };


        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            images.forEach(file => formData.append('images', file));
            videos.forEach(file => formData.append('videos', file));

            const response = await fetch(`https://a.khelogame.xyz/edit-project/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Project updated successfully:', result);
                // Handle success message or redirect
            } else {
                const error = await response.json();
                console.error('Error updating project:', error);
                // Handle error message
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleAddFloor = (buildingIndex) => {
        const newBuildings = [...buildings];
        newBuildings[buildingIndex].floors.push({
            floor_name: '',
            bedrooms: '',
            area: '',
            floor_price: '',
            floorPlan: null
        });
        setBuildings(newBuildings);
    };

    const handleBuildingChange = (buildingIndex, field, value) => {
        const newBuildings = [...buildings];
        newBuildings[buildingIndex] = {
            ...newBuildings[buildingIndex],
            [field]: value
        };
        setBuildings(newBuildings);
    };

    const handleFloorChange = (buildingIndex, floorIndex, field, value) => {
        setBuildings(prevBuildings => {
            const newBuildings = [...prevBuildings];
            const updatedFloors = newBuildings[buildingIndex].floors.map((floor, index) => {
                if (index === floorIndex) {
                    return { ...floor, [field]: value };
                }
                return floor;
            });
            newBuildings[buildingIndex] = { ...newBuildings[buildingIndex], floors: updatedFloors };
            return newBuildings;
        });
    };

    // const handleImageChange = (e) => {
    //     setImages([...images, ...e.target.files]);
    // };

    // const handleVideoChange = (e) => {
    //     setVideos([...videos, ...e.target.files]);
    // };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        setVideos(files);
        setVideoPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleFloorPlanChange = (buildingIndex, floorIndex, file) => {
        setBuildings(prevBuildings => {
            const newBuildings = [...prevBuildings];
            newBuildings[buildingIndex].floors[floorIndex].floorPlan = file;
            setFloorPlanPreviews(prevFloorPlans => {
                const newPreviews = [...prevFloorPlans];
                newPreviews[buildingIndex] = newPreviews[buildingIndex] || [];
                newPreviews[buildingIndex][floorIndex] = URL.createObjectURL(file);
                return newPreviews;
            });
            return newBuildings;
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <>
            <Navbar />
            <section className={styles.dashboard_main_box}>
                <h2>Edit Project</h2>
                <form onSubmit={handleSubmit} className={styles.formMainBox}>
                    <label htmlFor="projectName">Project Name</label>
                    <input id="projectName" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} />
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="4" cols="50" />
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    {/* <label htmlFor="images">Images</label>
                    <input id="images" type="file" multiple onChange={e => handleImageChange(e, setImages)} accept="image/*" /> */}
                    <label htmlFor="images">Images</label>
                    <input id="images" type="file" multiple onChange={handleImageChange} accept="image/*" />
                    <div>
                        {imagePreviews.map((preview, index) => (
                            <Image width={200} height={200} key={index} src={preview} alt={`Image preview ${index + 1}`} className={styles.previewImage} />
                        ))}
                    </div>
                    {/* <label htmlFor="videos">Videos</label>
                    <input id="videos" type="file" multiple onChange={e => handleVideoChange(e, setVideos)} accept="video/*" /> */}
                    <label htmlFor="videos">Videos</label>
                    <input id="videos" type="file" multiple onChange={handleVideoChange} accept="video/*" />
                    <div>
                        {videoPreviews.map((preview, index) => (
                            <video key={index} controls className={styles.previewVideo}>
                                <source src={preview} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ))}
                    </div>
                    <label htmlFor="developerName">Developer Name</label>
                    <input id="developerName" type="text" value={developerName} onChange={e => setDeveloperName(e.target.value)} />
                    <label htmlFor="location">Location</label>
                    <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)} />
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <input id="deliveryDate" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                    <label htmlFor="announcementDate">Announcement Date</label>
                    <input id="announcementDate" type="date" value={announcementDate} onChange={e => setAnnouncementDate(e.target.value)} />
                    <label htmlFor="constructionStartDate">Construction Start Date</label>
                    <input id="constructionStartDate" type="date" value={constructionStartDate} onChange={e => setConstructionStartDate(e.target.value)} />
                    <label htmlFor="expectedCompletionDate">Expected Completion Date</label>
                    <input id="expectedCompletionDate" type="date" value={expectedCompletionDate} onChange={e => setExpectedCompletionDate(e.target.value)} />
                    <label htmlFor="city">City</label>
                    <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} />
                    <label htmlFor="locality">Locality</label>
                    <input id="locality" type="text" value={locality} onChange={e => setLocality(e.target.value)} />
                    <label htmlFor="landZone">Land Zone</label>
                    <input id="landZone" type="text" value={landZone} onChange={e => setLandZone(e.target.value)} />
                    <label htmlFor="propertyType">Property Type</label>
                    <select id="propertyType" value={propertyType} onChange={e => setPropertyType(e.target.value)} >
                        <option value="">Select Property Type</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Agricultural">Agricultural</option>
                    </select>
                    <label htmlFor="numberOfBuildings">Number of Buildings</label>
                    <input id="numberOfBuildings" type="number" value={numberOfBuildings} onChange={e => setNumberOfBuildings(e.target.value)} />
                    <div>

                        {buildings.map((building, buildingIndex) => (
                            <div key={buildingIndex} className={styles.building_box_css}>
                                <label>Building {buildingIndex + 1}</label>
                                <input
                                    type="text"
                                    value={building.name || ''}
                                    onChange={(e) => handleBuildingChange(buildingIndex, 'name', e.target.value)}
                                    placeholder={`Building ${buildingIndex + 1} Name`}
                                />
                                {building.floors.map((floor, floorIndex) => (
                                    <div key={floorIndex} className={styles.floor_box_css}>
                                        <label>Floor {floorIndex + 1}</label>
                                        <input
                                            type="text"
                                            value={floor.floor_name || ''}
                                            onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'floor_name', e.target.value)}
                                            placeholder="Floor Name"
                                        />
                                        <input
                                            type="number"
                                            value={floor.bedrooms || ''}
                                            onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'bedrooms', e.target.value)}
                                            placeholder="Number of Bedrooms"
                                        />
                                        <input
                                            type="text"
                                            value={floor.area || ''}
                                            onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'area', e.target.value)}
                                            placeholder="Floor Area"
                                        />
                                        <input
                                            type="text"
                                            value={floor.floor_price || ''}
                                            onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'floor_price', e.target.value)}
                                            placeholder="Floor Price"
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => handleFloorPlanChange(buildingIndex, floorIndex, e.target.files[0])}
                                            accept="image/*"
                                        />
                                        {floorPlanPreviews[buildingIndex] && floorPlanPreviews[buildingIndex][floorIndex] && (
                                            <Image width={200} height={200} src={floorPlanPreviews[buildingIndex][floorIndex]} alt={`Floor Plan ${buildingIndex + 1}-${floorIndex + 1}`} className={styles.previewImage} />
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => handleAddFloor(buildingIndex)}
                                    className={styles.add_floor_css}
                                >
                                    <i className='bx bxs-add-to-queue'></i> Add Floor
                                </button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className={styles.submit_btn_css}>Update Project</button>
                </form>
            </section>
        </>
    );
};

export default EditProject;

