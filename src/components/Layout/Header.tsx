import { useDispatch } from 'react-redux';
import logo from '../../assets/images/logo.png';
import headerStyle from '../../styles/Layout/index.module.scss';
import { logout } from '../../store/authSlice';
import { AppDispatch } from '../../store/store';
import { Button } from '../shared/index'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
                    <Button href='/login'>Sign In</Button> :
                    <nav className={headerStyle.header__buttonContainer}>
                        <Button onClick={() => {
                            navigate('/app');
                        }}>App</Button>
                        <Button onClick={() => {
                            dispatch(logout());
                            navigate('/login');
                        }}>Exit</Button>
                    </nav>
                }
            </div>
        </header>
    )
}