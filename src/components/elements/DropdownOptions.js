import { logout } from "../../services/authServices"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getUser } from "../../services/authServices";

export const DropdownOptions = ({ setIsAuthenticated }) => {
    const [userDetails, setUserDetails] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
        navigate('/login')
    }

    useEffect(() => {
        async function fetchUserDetails() {
            try {
                const data = await getUser();
                setUserDetails(data || '');
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                setUserDetails('');
            }
        }

        fetchUserDetails();
    }, [])

    return (
        <div className="d-flex align-items-center ms-auto ms-lg-0 order-lg-last">
            <div className="dropdown">
                <Link className="nav-link dropdown-toggle d-flex align-items-center" to="#" role="button" id="userMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    <span className="d-none d-sm-inline">{userDetails?.fullName || "User"}</span>
                </Link>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuLink">
                    <li><Link className="dropdown-menu-item dropdown-item" to="#">Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" type="button" onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>
        </div>
    )
}
