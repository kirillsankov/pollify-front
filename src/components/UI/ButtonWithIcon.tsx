import { Link } from "react-router-dom";
import style from '../../assets/styles/FormInner.module.scss';

interface IProps {
    stringTo?: string; 
    children: React.ReactNode; 
    icon: React.ReactNode;
    className?: string; 
    onClick?: () => void;
}

function ButtonWithIcon({stringTo, children, icon, className, onClick}: IProps) {
    return (
        stringTo ? 
        <Link className={`${style.formInner__linkContainer} ${className}`} to={stringTo}>
            <div className={`${style.formInner__topIcon} ${style.formInner__topIcon__revert}`}>
                {icon}
            </div>
            <span className={style.formInner__iconText}>{children}</span> 
        </Link> : 
        <button className={`${style.formInner__linkContainer} ${className}`} onClick={onClick}>
            <div className={`${style.formInner__topIcon} ${style.formInner__topIcon__revert}`}>
                {icon}
            </div>
            <span className={style.formInner__iconText}>{children}</span> 
        </button>
    )

}

export default ButtonWithIcon;