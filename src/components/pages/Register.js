import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

import { register } from "../../services/authServices";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Register = () => {
    const navigate = useNavigate();
    const email = useRef();
    const password = useRef();
    const fullName = useRef();

    async function handleRegister(event) {
        event.preventDefault();
        try {
            const authDetails = {
                email: email.current.value,
                password: password.current.value,
                fullName: fullName.current.value,
            }
            const data = await register(authDetails);
            if (data) {
                navigate('/login')
            }
        } catch (error) {
            toast.error(error.message, { closeButton: true })
        }
    }
    return (
        <main>
            <div className="container1">
                <div className="card1 register">
                    <div className="card-body">
                        <nav className="nav">
                            <Link className="nav-link" to="/login">Sign in</Link>
                            <Link className="nav-link active" to="/register">Sign up</Link>
                        </nav>
                        <h3 className="card-title p-3">Register with your email</h3>
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input ref={email} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input ref={password} type="password" className="form-control" id="password" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fullName" className="form-label">Full Name</label>
                                <input ref={fullName} type="text" className="form-control" id="fullName" />
                            </div>
                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
