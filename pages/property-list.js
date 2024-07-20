import React, { useEffect, useState } from 'react';
import styles from "@/styles/PropertyList.module.css";
import Navbar from "@/components/Navbar";
import Image from 'next/image';

const propertyList = () => {
  const [properties, setProperties] = useState([]);

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
        } else {
          console.error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchProperties();
  }, []);


  return (
    <>
      <Navbar />
      {/* <!-- Dashboard --> */}
      <section className={styles.dashboard_main_box}>
        <h2>Property List</h2>
        <div className={styles.property_filter_big_box}>
          <div className={styles.search_property_box}>
            <input type="text" placeholder="Search By Location Name" />
            <i className='bx bx-search-alt'></i>
          </div>
          <div className={styles.search_property_box}>
            <select name="" id="">
              <option value="">Property Type</option>
              <option value="">For Rent</option>
              <option value="">For Buy</option>
            </select>
          </div>
          <div className={styles.search_property_box}>
            <select name="" id="">
              <option value="">Residential</option>
              <option value="">Commercial</option>
              <option value="">Land</option>
              <option value="">Multiple Units</option>
            </select>
          </div>
          <div className={styles.search_property_box}>
            <select name="" id="">
              <option value="">Total Bathroom</option>
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
              <option value="">4</option>
              <option value="">5</option>
              <option value="">5+</option>
            </select>
          </div>
          <div className={styles.search_property_box}>
            <select name="" id="">
              <option value="">Total Bedrooms</option>
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
              <option value="">4</option>
              <option value="">5</option>
              <option value="">5+</option>
            </select>
          </div>
          <button className={styles.search_filter_btn}><i className='bx bx-search-alt'></i> Search</button>
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
              {properties.map((property, index) => (

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
  )
}

export default propertyList