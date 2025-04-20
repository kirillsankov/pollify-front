import { NavLink } from "react-router-dom"
import style from '../../assets/styles/Application.module.scss'


const Aside = () => {
    return (
        <aside className={style.aside}>
        <ul className={style.aside__list}>
            <li>
                <NavLink 
                    className={({ isActive }) => 
                        isActive 
                            ? `${style.aside__link} ${style.aside__link__active}` 
                            : style.aside__link
                    } 
                    to="/app/stats"
                >
                    <span className={style.aside__icon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className={style.aside__svg} d="M20 5h-9.586L8.707 3.293A.997.997 0 0 0 8 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2"></path>
                        </svg>
                    </span> 
                    <span>
                        My Forms
                    </span>
                </NavLink>
            </li>
            <li>
                <NavLink 
                    className={({ isActive }) => 
                        isActive 
                            ? `${style.aside__link} ${style.aside__link__active}` 
                            : style.aside__link
                    } 
                    to="/app/create"
                >
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path className={style.aside__svg} d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path>
                        </svg>
                    </span> 
                    Create forms
                </NavLink>
            </li>
        </ul>
    </aside>
    )
}

export default Aside;