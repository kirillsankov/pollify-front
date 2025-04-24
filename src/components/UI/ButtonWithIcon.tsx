import { Link } from "react-router-dom";
import style from '../../assets/styles/FormInner.module.scss';


function ButtonWithIcon({stringTo, children, icon}: {stringTo: string, children: React.ReactNode, icon: React.ReactNode}) {
    return (
        <Link className={style.formInner__linkContainer} to={stringTo}>
            <div className={`${style.formInner__topIcon} ${style.formInner__topIcon__revert}`}>
                {icon}
            </div>
            <span className={style.formInner__iconText}>{children}</span> 
        </Link>  
    )

}

export default ButtonWithIcon;