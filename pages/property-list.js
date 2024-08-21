import React, { useEffect, useState } from 'react';
import styles from "@/styles/PropertyList.module.css";
import Navbar from "@/components/Navbar";
import Image from 'next/image';
import { useRouter } from 'next/router';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    subType: '',
    bedroom: '',
    role: ''
  });
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const router = useRouter();
  const { status } = router.query;

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


  const applyFilters = () => {
    let tempProperties = [...properties];

    if (filters.propertyType) {
      tempProperties = tempProperties.filter(
        (property) => property.property_categories === filters.propertyType
      );
    }

    if (filters.subType) {
      tempProperties = tempProperties.filter(
        (property) => property.property_type === filters.subType
      );
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      tempProperties = tempProperties.filter(
        (property) => property.location && property.location.toLowerCase().includes(locationLower)
      );
    }

    if (filters.bedroom) {
      if (filters.bedroom === '5+') {
        tempProperties = tempProperties.filter((property) => property.bedroom >= 5);
      } else {
        tempProperties = tempProperties.filter(
          (property) => property.bedroom === parseInt(filters.bedroom, 10)
        );
      }
    }

    if (filters.role) {
      tempProperties = tempProperties.filter(
        (property) => property.role === filters.role
      );
    }

    // Apply approval status filter based on state
    if (showApprovedOnly) {
      tempProperties = tempProperties.filter(
        (property) => property.status === 'approved'
      );
    }

    setFilteredProperties(tempProperties);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://a.khelogame.xyz/admin/all-properties', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProperties(data);
          // setFilteredProperties(data);
          if (status === 'approved') {
            setFilteredProperties(data.filter(property => property.status === 'approved'));
          } else {
            setFilteredProperties(data);
          }
        } else {
          console.error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, showApprovedOnly]);

  return (
    <>
      <Navbar />
      {/* <!-- Dashboard --> */}
      <section className={styles.dashboard_main_box}>
        <h2>Property List</h2>
        <div className={styles.property_filter_big_box}>
          <div className={styles.search_property_box}>
            <input type="text" placeholder="Search By Location Name" value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
            <i className='bx bx-search-alt'></i>
          </div>
          <div className={styles.search_property_box}>
            <select name="" id=""
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            >
              <option value="">Property Type</option>
              <option value="Rent">For Rent</option>
              <option value="Buy">For Buy</option>
            </select>
          </div>

          <div className={styles.search_property_box}>
            <select
              value={filters.subType}
              onChange={(e) => setFilters({ ...filters, subType: e.target.value })}
            >
              <option value="">Property Subtype</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
              <option value="Multiple Units">Multiple Units</option>
            </select>
          </div>

          <div className={styles.search_property_box}>
            <select
              value={filters.bedroom}
              onChange={(e) => setFilters({ ...filters, bedroom: e.target.value })}
            >
              <option value="">Total Bedrooms</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="5+">5+</option>
            </select>
          </div>

          <div className={styles.search_property_box}>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">Property By User/Agent</option>
              <option value="user">User Property</option>
              <option value="admin">Agent Property</option>
            </select>
          </div>

          <button className={styles.search_filter_btn} onClick={applyFilters}><i className='bx bx-search-alt'></i> Search</button>
          {/* <button className={styles.search_filter_btn} onClick={() => setShowApprovedOnly(!showApprovedOnly)}>
            {showApprovedOnly ? 'Show All Properties' : 'Show Approved Only'}
          </button> */}
        </div>
        <div className={styles.table_big_box}>
          <table className={styles.customers}>
            <thead>
              <tr>
                <th>S No.</th>
                <th>Property Name</th>
                <th>Property Image</th>
                <th>Property Type</th>
                <th>Price</th>
                <th>Owner</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>
              {filteredProperties.map((property, index) => (
                <tr key={property.property_id}>
                  <td>{index + 1}</td>
                  <td>{property.property_name}</td>
                  <td>
                    <Image
                      width={200}
                      height={200}
                      src={property.image_path ? `https://a.khelogame.xyz/${property.image_path}` : '/images/default-property.png'}
                      alt={property.property_name}
                      className={styles.property_image_css}
                    />
                  </td>
                  <td>{property.property_type}</td>
                  <td>{property.price}</td>
                  <td>{property.username}</td>
                  <td>{property.role}</td>
                  <td>{property.status}</td>
                  <td>{new Date(property.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </section>
    </>
  );
};

export default PropertyList;
