import { useDispatch } from 'react-redux';
import logo from '../assets/images/logo.png'
import headerStyle from '../assets/styles/Header.module.scss'
import { logout } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import { Button } from './UI/Button'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export function Header() {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    return (
        <header className={headerStyle.header}>
            <div className={`${headerStyle.container} ${headerStyle.header__container}`}>
                <Link to="/" className={`${headerStyle.header__logo} logo`}>
                    <img src={logo} alt="logo" />
                </Link>
                {
                    !isAuthenticated ?
                    <Button href='/login' text='Sign In'></Button> :
                    <button onClick={() => {
                        dispatch(logout());
                        navigate('/login');
                    }}>Exit</button>
                }
            </div>
        </header>
    )
}