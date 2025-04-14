import logo from '../assets/images/logo.png'
import headerStyle from '../assets/styles/Header.module.scss'
import { Button } from './UI/Button'
import { Link } from 'react-router-dom';
export function Header() {
    return (
        <header className={headerStyle.header}>
            <div className={`${headerStyle.container} ${headerStyle.header__container}`}>
                <Link to="/" className={`${headerStyle.header__logo} logo`}>
                    <img src={logo} alt="logo" />
                </Link>
                <Button href='/login' text='Sign In'></Button>
            </div>
        </header>
    )
}