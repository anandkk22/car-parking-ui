import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

import { login } from "../../services/authServices";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const email = useRef();
    const password = useRef();

    async function handleLogin(event) {
        event.preventDefault();
        try {
            const authDetails = {
                email: email.current.value,
                password: password.current.value,
            }
            const data = await login(authDetails);
            if (data.token) {
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                toast.error(data);
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
                            <Link className="nav-link active" to="/login">Sign in</Link>
                            <Link className="nav-link" to="/register">Sign up</Link>
                        </nav>
                        <h3 className="card-title p-3">Login with your email</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input ref={email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input ref={password} type="password" className="form-control" id="exampleInputPassword1" />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
