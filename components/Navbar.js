import React, { useState } from "react";
import styles from "@/styles/Navbar.module.css";
import Image from 'next/image';
import Link from "next/link";

const Navbar = () => {
    const [dropdownOpen1, setDropdownOpen1] = useState(true);
    const [dropdownOpen2, setDropdownOpen2] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const toggleDropdown1 = () => {
        setDropdownOpen1(!dropdownOpen1);
    };
    const toggleDropdown2 = () => {
        setDropdownOpen2(!dropdownOpen2);
    };

    const handleLogout = () => {
        localStorage.clear()
        location.href = "/login"
    };

    return (
        <>
            {/* <!-- navbar --> */}
            <nav className={styles.navbar}>
                <div className={styles.logo_item}>
                    <i className={`bx bx-menu ${styles.tri_arrow}`} onClick={toggleSidebar}></i>
                    <Link href="/"><Image width={200} height={200} src="/images/logo.png" alt="" /></Link>
                </div>

                <div className={styles.navbar_content}>
                    <Link href="/profile"><Image width={200} height={200} src="/images/profile.jpg" alt="" className={styles.profile} /></Link>
                    <button className={styles.logout_btn} onClick={handleLogout}><i className='bx bx-log-out'></i> Log Out</button>
                </div>
            </nav>

            {/* <!-- sidebar --> */}
            <nav className={`${styles.sidebar} ${sidebarOpen ? "" : styles.close}`}>
                <div className={styles.menu_content}>
                    <ul className={styles.menu_items}>
                        {/* <!-- start --> */}
                        <li className={styles.item}>
                            <Link href="/" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className="bx bxs-dashboard"></i>
                                </span>
                                <span className={styles.navlink}>Dashboard</span>
                            </Link>
                        </li>
                        {/* <!-- end --> */}

                        {/* <!-- start --> */}
                        <li className={styles.item}>
                            <div href="#" className={`${styles.nav_link} ${styles.submenu_item} ${dropdownOpen1 ? "" : styles.show_submenu}`} onClick={toggleDropdown1}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-user-circle'></i>
                                </span>
                                <span className={styles.navlink}>Agents</span>
                                <i className={`bx bx-chevron-right ${styles.arrow_left}`}></i>
                            </div>

                            <ul className={`${styles.submenu} ${styles.menu_items}`}>
                                <Link href="/add-agent" className={`${styles.sublink} ${styles.nav_link}`}>Add Agent</Link>
                                <Link href="/all-agents" className={`${styles.sublink} ${styles.nav_link}`}>All Agents</Link>
                            </ul>
                        </li>
                        {/* <!-- end --> */}

                        {/* <!-- start --> */}
                        <li className={styles.item}>
                            <div href="#" className={`${styles.nav_link} ${styles.submenu_item} ${dropdownOpen2 ? "" : styles.show_submenu}`} onClick={toggleDropdown2}>
                                <span className={styles.navlink_icon}>
                                    <i className="bx bx-grid-alt"></i>
                                </span>
                                <span className={styles.navlink}>Projects</span>
                                <i className={`bx bx-chevron-right ${styles.arrow_left}`}></i>
                            </div>

                            <ul className={`${styles.submenu} ${styles.menu_items}`}>
                                <Link href="/add-project" className={`${styles.sublink} ${styles.nav_link}`}>Add Projects</Link>
                                <Link href="/project-list" className={`${styles.sublink} ${styles.nav_link}`}>Projects List</Link>
                            </ul>
                        </li>
                        {/* <!-- end --> */}
                    </ul>

                    <ul className={styles.menu_items}>

                        {/* <!-- Start --> */}
                        <li className={styles.item}>
                            <Link href="/property-list" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bx-building-house'></i>
                                </span>
                                <span className={styles.navlink}>Property List</span>
                            </Link>
                        </li>
                        {/* <!-- End --> */}

                        <li className={styles.item}>
                            <Link href="/user-list" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-user-pin'></i>
                                </span>
                                <span className={styles.navlink}>User List</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/agent-list-propety" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-landscape'></i>
                                </span>
                                <span className={styles.navlink}>Agent Property List</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/all-reviews" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-star'></i>
                                </span>
                                <span className={styles.navlink}>All Reviews</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/new-property" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bx-list-ol'></i>
                                </span>
                                <span className={styles.navlink}>New Property List</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/contact-us-enquiries" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-contact'></i>
                                </span>
                                <span className={styles.navlink}>Contact Us Enquiries</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/property-page-enquiry" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-info-circle'></i>
                                </span>
                                <span className={styles.navlink}>Property Enquiries</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/agent-page-enquiry" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-book-content'></i>
                                </span>
                                <span className={styles.navlink}>Agent Enquiries</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/manage-website-number" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bx-edit'></i>
                                </span>
                                <span className={styles.navlink}>Manage Number</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/all-subscription-plan" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-paper-plane'></i>
                                </span>
                                <span className={styles.navlink}>Subscription Plan</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/all-user-subscription" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-moon'></i>
                                </span>
                                <span className={styles.navlink}>User Subscription</span>
                            </Link>
                        </li>

                        <li className={styles.item}>
                            <Link href="/all-transtion-approval-list" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-sticker'></i>
                                </span>
                                <span className={styles.navlink}>Transtion Approval</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/admin_wallet_coin" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i className='bx bxs-coin'></i>
                                </span>
                                <span className={styles.navlink}>Wallet Coins</span>
                            </Link>
                        </li>
                        <li className={styles.item}>
                            <Link href="/purchased-subscription-plan" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i class='bx bxs-leaf'></i>
                                </span>
                                <span className={styles.navlink}>Active Subscription</span>
                            </Link>
                        </li>

                        <li className={styles.item}>
                            <Link href="/all-transtion-history" className={styles.nav_link}>
                                <span className={styles.navlink_icon}>
                                    <i class='bx bx-list-check'></i>
                                </span>
                                <span className={styles.navlink}>Transaction History</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar