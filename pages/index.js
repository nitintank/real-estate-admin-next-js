import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {

  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [approvedPropertyCount, setApprovedPropertyCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // user listing
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('https://a.khelogame.xyz/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  // agent listing
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://a.khelogame.xyz/all_agents');
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // all Properties listing

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
          // d
          const approvedCount = data.filter(property => property.status === 'approved').length;
          setApprovedPropertyCount(approvedCount);
        } else {
          console.error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchProperties();
  }, []);

  // all user puchaase subscripton plan
  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const response = await fetch('https://a.khelogame.xyz/admin/all-user-subscriptions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setPlans(data.users || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlans();
  }, []);

  // all trnastion
  useEffect(() => {
    const fetchAgentTransactions = async () => {
      try {
        const response = await fetch('https://a.khelogame.xyz/admin/agent-transactions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch agent transactions');
        }
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setTransactions(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentTransactions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Navbar />
      {/* <!-- Dashboard --> */}
      <section className={styles.dashboard_main_box}>
        <h2>Dashboard</h2>
        <div className={styles.dashboard_content_cards_big_box}>
          <Link href={`/user-list`} className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/user-list-img.jpg" alt="" />
            <p>User Listing  </p>
            <h4>{users.length}</h4>
          </Link>

          <Link href={`/all-agents`} className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/agent-img.jpg" alt="" />
            <p>Agent Listing  </p>
            <h4>{agents.length}</h4>
          </Link>

          <Link href={`/property-list`} className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/all-property.jpg" alt="" />
            <p> All Properties</p>
            <h4>{properties.length}</h4>
          </Link>

          <Link href={`/property-list?status=approved`} className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-2.png" alt="" />
            <p> Live Property</p>
            <h4>{approvedPropertyCount}</h4>
          </Link>

          <Link href={`/all-transtion-approval-list?status=approved`} className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-3.png" alt="" />
            <p>Transactions</p>
            <h4>{transactions.length}</h4>
          </Link>

          <Link href={`/all-user-subscription`} className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-4.png" alt="" />
            <p>Subscription</p>
            <h4>{plans.length}</h4>
          </Link>
        </div>

        <div className={styles.below_big_box}>
          {/* <!-- Total Revenue Section --> */}
          <div className={styles.total_revenue_section}>
            <h3>Total Revenue</h3>
            <div className={styles.simple_bar_chart}>
              <div className={styles.item} style={{ '--clr': '#FCB72A', '--val': '50' }}>
                <div className={styles.label}>2019-20</div>
                <div className={styles.value}>50%</div>
              </div>
              <div className={styles.item} style={{ '--clr': '#F8821A', '--val': '100' }}>
                <div className={styles.label}>2020-21</div>
                <div className={styles.value}>100%</div>
              </div>
              <div className={styles.item} style={{ '--clr': '#E0393E', '--val': '15' }}>
                <div className={styles.label}>2021-22</div>
                <div className={styles.value}>15%</div>
              </div>
              <div className={styles.item} style={{ '--clr': '#963D97', '--val': '10' }}>
                <div className={styles.label}>2022-23</div>
                <div className={styles.value}>10%</div>
              </div>
              <div className={styles.item} style={{ '--clr': '#069CDB', '--val': '90' }}>
                <div className={styles.label}>2023-24</div>
                <div className={styles.value}>90%</div>
              </div>
            </div>
          </div>
          {/* <!-- Recent Customers --> */}
          <div className={styles.recent_customers_big_box}>
            <h3>Recent Customers</h3>
            <div className={styles.recent_customer_box}>
              <div className={styles.customer_detail}>
                <Image width={200} height={200} src="https://griya.dexignzone.com/xhtml/images/contacts/pic222.jpg" alt="" />
                <div className={styles.customer_content}>
                  <p>Benny Chagur</p>
                  <p><span>MEMBER</span></p>
                </div>
              </div>
              <div className={styles.customer_detail}>
                <Image width={200} height={200} src="https://griya.dexignzone.com/xhtml/images/contacts/pic222.jpg" alt="" />
                <div className={styles.customer_content}>
                  <p>David heree</p>
                  <p><span>MEMBER</span></p>
                </div>
              </div>
              <div className={styles.customer_detail}>
                <Image width={200} height={200} src="https://griya.dexignzone.com/xhtml/images/contacts/pic222.jpg" alt="" />
                <div className={styles.customer_content}>
                  <p>Benny Chagur</p>
                  <p><span>MEMBER</span></p>
                </div>
              </div>
            </div>
            <button><i className='bx bxs-plus-circle'></i> Add New Customer</button>
          </div>
        </div>
      </section>

    </>
  );
}
