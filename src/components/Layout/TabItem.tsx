import { NavLink } from 'react-router-dom';
import style from '../../styles/Application/index.module.scss';

interface IProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    to: string;
}

const TabItem = ({  children, icon, to } : IProps) => {
    return (
        <li>
        <NavLink 
            className={({ isActive }) => 
                isActive 
                    ? `${style.aside__link} ${style.aside__link__active}` 
                    : style.aside__link
            } 
            to={to}
        >
            <span className={style.aside__icon}>
                {icon}
            </span> 
            <span>
                {children}
            </span>
        </NavLink>
    </li>
    )
}

export default TabItem;