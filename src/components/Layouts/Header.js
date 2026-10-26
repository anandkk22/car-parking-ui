import Logo from '../../assets/parking.png'
import { Link } from "react-router-dom"
import { DropdownOptions } from '../elements/DropdownOptions'

export const Header = ({ isAuthenticated, setIsAuthenticated }) => {

    return (
        <nav className="navbar fixed-top navbar-expand-sm border-bottom">
            <div className="container">
                <Link to="" className="navbar-brand"><img src={Logo} className="img-fluid" style={{ maxHeight: '40px' }} alt="Car Parking Logo" /></Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mt-2">
                        <li className="nav-item">
                            <Link to="/home" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/report" className="nav-link">Report</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/admin-panel" className="nav-link">Admin Panel</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contacts</Link>
                        </li>
                    </ul>
                    {isAuthenticated
                        ? <DropdownOptions setIsAuthenticated={setIsAuthenticated} />
                        : <div className="d-flex"><Link to="/login" className="btn btn-outline-success mt-3">Sign In</Link></div>}
                </div>
            </div>
        </nav>

    )
}
