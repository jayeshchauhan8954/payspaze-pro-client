import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../api/base_url';
import { apiRequest } from '../../utils/apiRequest';
import { logout } from '../../redux/slicers/auth';
import { useDispatch } from 'react-redux';
import { removeAuthCookie } from '../../utils/authHelpers';

const Header = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            setLoading(true);
            const { status } = await apiRequest({
                endUrl: `${BASE_URL}/user/logout`,
                method: 'POST',
                showMsg: true,
            });
            setLoading(false);
            if (status) {
                removeAuthCookie()
                dispatch(logout());
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            console.error("Logout failed", error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar className="px-4">
                <div className="flex justify-between w-full">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 className="text-teal-600 font-bold text-2xl">
                            Pay<span className="text-orange-400">Spaze</span>
                        </h1>
                    </Link>

                    <div>
                        {isAuthenticated ? (
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={handleLogout} 
                                disabled={loading}
                                className="ml-2"
                            >
                                {loading ? "Logging out..." : "Logout"}
                            </Button>
                        ) : (
                            <div className="flex space-x-4">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    component={Link} 
                                    to="/sign-in"
                                >
                                    Log In
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    component={Link} 
                                    to="/sign-up"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
