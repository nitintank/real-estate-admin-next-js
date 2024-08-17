import React, { useEffect, useState } from 'react';
import styles from "@/styles/NewProperty.module.css";
import Navbar from "@/components/Navbar";

const NewProperty = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    subType: '',
    bedroom: '',
    role: ''
  });


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

    setFilteredProperties(tempProperties);
  };


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://a.khelogame.xyz/admin/new-properties', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      const response = await fetch(`https://a.khelogame.xyz/admin/property/${propertyId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedProperty = await response.json();
      setProperties(prevProperties =>
        prevProperties.map(property =>
          property.property_id === propertyId ? { ...property, status: newStatus } : property
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      {/* <!-- Dashboard --> */}
      <section className={styles.dashboard_main_box}>
        <h2>New Property List</h2>
        <div className={styles.property_filter_big_box}>
          <div className={styles.search_property_box}>
            <input type="text" placeholder="Search By Location Name" value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
            <i className='bx bx-search-alt'></i>
          </div>
          <div className={styles.search_property_box}>
            <select name="" id=""
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}>
              <option value="">Property Type</option>
              <option value="Rent">For Rent</option>
              <option value="Buy">For Buy</option>
            </select>
          </div>

          <div className={styles.search_property_box}>
            <select
              value={filters.subType}
              onChange={(e) => setFilters({ ...filters, subType: e.target.value })}>
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
              onChange={(e) => setFilters({ ...filters, bedroom: e.target.value })}>
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
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className={styles.table_big_box}>
            <table className={styles.customers}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Property Name</th>
                  <th>Property Type</th>
                  <th>Property Subtype</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property, index) => (
                  <tr key={property.property_id}>
                    <td>{index + 1}</td>
                    <td>{property.username}</td>
                    <td>{property.email}</td>
                    <td>{property.phone_number}</td>
                    <td>{property.property_name}</td>
                    <td>{property.property_type}</td>
                    <td>{property.property_subtype}</td>
                    <td>{property.price}</td>
                    <td>
                      <select
                        value={property.status}
                        onChange={(e) => handleStatusChange(property.property_id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default NewProperty