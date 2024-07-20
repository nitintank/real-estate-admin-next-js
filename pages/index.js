import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Navbar from "@/components/Navbar";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Check local storage if user is logged in
    const loggedInStatus = localStorage.getItem('username');
    if (loggedInStatus == null) {
        location.href = "/login"
    }
  }, []);
  return (
    <>
      <Navbar/>
      {/* <!-- Dashboard --> */}
      <section className={styles.dashboard_main_box}>
        <h2>Dashboard</h2>
        <div className={styles.dashboard_content_cards_big_box}>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-1.png" alt="" />
            <p>Properties for Rent</p>
            <h4>546</h4>
          </div>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-2.png" alt="" />
            <p>Properties for Sale</p>
            <h4>684</h4>
          </div>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-3.png" alt="" />
            <p>Total Customer</p>
            <h4>999</h4>
          </div>
          <div className={styles.dashboard_content_cards}>
            <Image width={200} height={200} src="/images/ad-ico-4.png" alt="" />
            <p>Total City</p>
            <h4>75</h4>
          </div>
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
