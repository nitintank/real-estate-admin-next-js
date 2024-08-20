import React, { useState } from 'react';
import styles from "@/styles/AddProject.module.css";
import Navbar from "@/components/Navbar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProject = () => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
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
        { name: '', floors: [{ name: '', bedrooms: '', area: '', floor_price: '', floorPlan: null }] }
    ]);
    const [amenities, setAmenities] = useState({
        recreationAndFamily: [],
        healthAndFitness: [],
        features: [],
        cleaningAndMaintenance: []
    });
    const [errors, setErrors] = useState({});

    // // Handle file uploads
    const handleFileChange = (e, setState) => {
        const files = Array.from(e.target.files);
        setState(files);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!propertyType) newErrors.propertyType = 'Property type is required';
        if (!description) newErrors.description = 'Description is required';
        if (!price) newErrors.price = 'Area is required';
        if (!projectName) newErrors.projectName = 'Project Name is required';
        if (!developerName) newErrors.developerName = 'developer Name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Construct the data object to send
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
                acc[building.name] = building.floors.map(floor => {
                    console.log(floor, "floor");
                    return {
                        floor_name: floor.name,
                        floor_area: floor.area,
                        floor_bedrooms: floor.bedrooms,
                        floor_price: floor.floor_price,
                        floor_plan_image: floor.floorPlan ? floor.floorPlan.name : null
                    };
                });
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
            // Create FormData object for file uploads
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));
            images.forEach(file => formData.append('images', file));
            videos.forEach(file => formData.append('videos', file));

            buildings.forEach(building => {
                building.floors.forEach(floor => {
                    if (floor.floorPlan) {
                        formData.append('floorPlans', floor.floorPlan);
                    }
                });
            });

            // Make POST request to the API
            const response = await fetch('https://a.khelogame.xyz/add-project', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Project added successfully:', result);
                toast.success('Project added successfully!');

            } else {
                const error = await response.json();
                toast.error(`Error: ${errorData.message}`);
                console.error('Error adding project:', error);
                // Handle error message
            }
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error('Error adding project:', error);
        }
    };

    // Handlers for dynamically adding buildings and floors
    const handleAddBuilding = () => {
        setBuildings([...buildings, { name: '', floors: [{ name: '', bedrooms: '', area: '', floor_price: '', floorPlan: null }] }]);
    };

    const handleAddFloor = (buildingIndex) => {
        const updatedBuildings = [...buildings];
        updatedBuildings[buildingIndex].floors.push({ name: '', bedrooms: '', area: '', floor_price: '', floorPlan: null });
        setBuildings(updatedBuildings);
    };

    const handleBuildingChange = (buildingIndex, field, value) => {
        const updatedBuildings = [...buildings];
        updatedBuildings[buildingIndex][field] = value;
        setBuildings(updatedBuildings);
    };

    // const handleFloorChange = (buildingIndex, floorIndex, field, value) => {
    //     const updatedBuildings = [...buildings];
    //     updatedBuildings[buildingIndex].floors[floorIndex][field] = value;
    //     console.log(updatedBuildings, "updatedBuildings");
    //     setBuildings(updatedBuildings);
    //     // handleAddBuilding();
    // };

    const handleFloorChange = (buildingIndex, floorIndex, field, value) => {
        const updatedBuildings = [...buildings];
        if (field === 'floorPlan') {
            updatedBuildings[buildingIndex].floors[floorIndex][field] = value[0]; // Set the first file if multiple files are selected
        } else {
            updatedBuildings[buildingIndex].floors[floorIndex][field] = value;
        }
        setBuildings(updatedBuildings);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImagePaths) => [...prevImagePaths, ...files]);
    };

    return (
        <>
            <Navbar />
            <ToastContainer />
            {/* <!-- Dashboard --> */}
            <section className={styles.dashboard_main_box}>
                <h2>Add New Project</h2>
                <form onSubmit={handleSubmit} className={styles.formMainBox}>
                    <label htmlFor="projectName">Project Name</label>
                    <input id="projectName" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} required />
                    {errors.projectName && <p className={styles.errorText}>{errors.projectName}</p>}
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows="4" cols="50" />
                    {errors.description && <p className={styles.errorText}>{errors.description}</p>}
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                    {errors.price && <p className={styles.errorText}>{errors.price}</p>}

                    <label htmlFor="images">Images</label>
                    {/* <input id="images" type="file" multiple onChange={e => handleFileChange(e, setImages)} accept="image/*" /> */}
                    <input id="images" type="file" multiple onChange={handleImageChange} />
                    <div>
                        {images.map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Floor Map Image ${index + 1}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0px 10px', borderRadius: '10px' }}
                            />
                        ))}
                    </div>

                    <label htmlFor="videos">Videos</label>
                    <input id="videos" type="file" multiple onChange={e => handleFileChange(e, setVideos)} accept="video/*" />
                    <label htmlFor="developerName">Developer Name</label>
                    <input id="developerName" type="text" value={developerName} onChange={e => setDeveloperName(e.target.value)} required />
                    {errors.developerName && <p className={styles.errorText}>{errors.developerName}</p>}
                    <label htmlFor="location">Location</label>
                    <input id="location" type="text" value={location} onChange={e => setLocation(e.target.value)} required />
                    <label htmlFor="deliveryDate">Delivery Date</label>
                    <input id="deliveryDate" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} required />
                    <label htmlFor="announcementDate">Announcement Date</label>
                    <input id="announcementDate" type="date" value={announcementDate} onChange={e => setAnnouncementDate(e.target.value)} required />
                    <label htmlFor="constructionStartDate">Construction Start Date</label>
                    <input id="constructionStartDate" type="date" value={constructionStartDate} onChange={e => setConstructionStartDate(e.target.value)} required />
                    <label htmlFor="expectedCompletionDate">Expected Completion Date</label>
                    <input id="expectedCompletionDate" type="date" value={expectedCompletionDate} onChange={e => setExpectedCompletionDate(e.target.value)} required />
                    <label htmlFor="city">City</label>
                    <input id="city" type="text" value={city} onChange={e => setCity(e.target.value)} required />
                    <label htmlFor="locality">Locality</label>
                    <input id="locality" type="text" value={locality} onChange={e => setLocality(e.target.value)} required />
                    <label htmlFor="landZone">Land Zone</label>
                    <input id="landZone" type="text" value={landZone} onChange={e => setLandZone(e.target.value)} required />
                    <label htmlFor="propertyType">Property Type</label>
                    <select id="propertyType" value={propertyType} onChange={e => setPropertyType(e.target.value)} required>
                        <option value="" disabled>Select Property Type</option>
                        <option value="Flat/ Apartment">Flat/ Apartment</option>
                        <option value="Residential House">Residential House</option>
                        <option value="Villa">Villa</option>
                        <option value="Builder Floor Apartment">Builder Floor Apartment</option>
                        <option value="Residential Land/ Plot">Residential Land/ Plot</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Studio Apartment">Studio Apartment</option>
                        <option value="Commercial Office Space">Commercial Office Space</option>
                        <option value="Office in IT Park/ SEZ">Office in IT Park/ SEZ</option>
                        <option value="Commercial Shop">Commercial Shop</option>
                        <option value="Commercial Showroom">Commercial Showroom</option>
                        <option value="Commercial Land">Commercial Land</option>
                        <option value="Warehouse/ Godown">Warehouse/ Godown</option>
                        <option value="Industrial Land">Industrial Land</option>
                        <option value="Industrial Building">Industrial Building</option>
                        <option value="Industrial Shed">Industrial Shed</option>
                        <option value="Agricultural Land">Agricultural Land</option>
                        <option value="Farm House">Farm House</option>
                    </select>
                    {errors.propertyType && <p className={styles.errorText}>{errors.propertyType}</p>}
                    <label htmlFor="numberOfBuildings">Number of Buildings</label>
                    <input
                        id="numberOfBuildings"
                        type="number"
                        value={numberOfBuildings}
                        onChange={(e) => {
                            const num = Number(e.target.value);
                            setNumberOfBuildings(num);
                            setBuildings(Array(num).fill().map(() => ({ name: '', floors: [{ name: '', bedrooms: '', area: '', floor_price: '', floorPlan: null }] })));
                        }}
                        min="1"
                        required
                    />
                    {errors.projectName && <p className={styles.errorText}>{errors.projectName}</p>}
                    {buildings.map((building, buildingIndex) => (
                        <div key={buildingIndex} className={styles.building_box_css}>
                            <label>Building {buildingIndex + 1}</label>
                            <input
                                type="text"
                                value={building.name}
                                onChange={(e) => handleBuildingChange(buildingIndex, 'name', e.target.value)}
                                placeholder={`Building ${buildingIndex + 1} Name`}
                                required
                            />
                            {building.floors.map((floor, floorIndex) => (
                                <div key={floorIndex} className={styles.floor_box_css}>
                                    <label>Floor {floorIndex + 1}</label>
                                    <input
                                        type="text"
                                        value={floor.name}
                                        onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'name', e.target.value)}
                                        placeholder="Floor Name"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={floor.bedrooms}
                                        onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'bedrooms', e.target.value)}
                                        placeholder="Number of Bedrooms"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={floor.area}
                                        onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'area', e.target.value)}
                                        placeholder="Floor Area"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={floor.floor_price}
                                        onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'floor_price', e.target.value)}
                                        placeholder="Floor Price"
                                        required
                                    />
                                    <input
                                        type="file"
                                        onChange={(e) => handleFloorChange(buildingIndex, floorIndex, 'floorPlan', e.target.files[0])}
                                        accept="image/*"
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddFloor(buildingIndex)} className={styles.add_floor_css}><i class='bx bxs-add-to-queue'></i> Add Floor</button>
                        </div>
                    ))}
                    <label className={styles.label_font_size}>Amenities</label>
                    <fieldset className={styles.fieldset_css}>
                        <legend>Recreation and Family</legend>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="playArea" value="Play Area" onChange={e => setAmenities(prev => ({ ...prev, recreationAndFamily: [...prev.recreationAndFamily, e.target.value] }))} />
                            <label htmlFor="playArea">Play Area</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="clubHouse" value="Club House" onChange={e => setAmenities(prev => ({ ...prev, recreationAndFamily: [...prev.recreationAndFamily, e.target.value] }))} />
                            <label htmlFor="clubHouse">Club House</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="landscapeGarden" value="Landscape Garden" onChange={e => setAmenities(prev => ({ ...prev, recreationAndFamily: [...prev.recreationAndFamily, e.target.value] }))} />
                            <label htmlFor="landscapeGarden">Landscape Garden</label>
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset_css}>
                        <legend>Health and Fitness</legend>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="gym" value="Gym" onChange={e => setAmenities(prev => ({ ...prev, healthAndFitness: [...prev.healthAndFitness, e.target.value] }))} />
                            <label htmlFor="gym">Gym</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="swimmingPool" value="Swimming Pool" onChange={e => setAmenities(prev => ({ ...prev, healthAndFitness: [...prev.healthAndFitness, e.target.value] }))} />
                            <label htmlFor="swimmingPool">Swimming Pool</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="joggingTrack" value="Jogging Track" onChange={e => setAmenities(prev => ({ ...prev, healthAndFitness: [...prev.healthAndFitness, e.target.value] }))} />
                            <label htmlFor="joggingTrack">Jogging Track</label>
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset_css}>
                        <legend>Features</legend>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="intercom" value="Intercom" onChange={e => setAmenities(prev => ({ ...prev, features: [...prev.features, e.target.value] }))} />
                            <label htmlFor="intercom">Intercom</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="security" value="Security" onChange={e => setAmenities(prev => ({ ...prev, features: [...prev.features, e.target.value] }))} />
                            <label htmlFor="security">Security</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="parking" value="Parking" onChange={e => setAmenities(prev => ({ ...prev, features: [...prev.features, e.target.value] }))} />
                            <label htmlFor="parking">Parking</label>
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldset_css}>
                        <legend>Cleaning and Maintenance</legend>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="garbageDisposal" value="Garbage Disposal" onChange={e => setAmenities(prev => ({ ...prev, cleaningAndMaintenance: [...prev.cleaningAndMaintenance, e.target.value] }))} />
                            <label htmlFor="garbageDisposal">Garbage Disposal</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="maintenanceStaff" value="Maintenance Staff" onChange={e => setAmenities(prev => ({ ...prev, cleaningAndMaintenance: [...prev.cleaningAndMaintenance, e.target.value] }))} />
                            <label htmlFor="maintenanceStaff">Maintenance Staff</label>
                        </div>
                        <div className={styles.checkbox_css}>
                            <input type="checkbox" id="waterSupply" value="Water Supply" onChange={e => setAmenities(prev => ({ ...prev, cleaningAndMaintenance: [...prev.cleaningAndMaintenance, e.target.value] }))} />
                            <label htmlFor="waterSupply">Water Supply</label>
                        </div>
                    </fieldset>
                    <button type="submit" className={styles.submit_btn_css}><i class='bx bxs-add-to-queue'></i> Add Project</button>
                </form>
            </section>
        </>
    )
}

export default AddProject