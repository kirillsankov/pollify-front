import { JSX } from "react";
import styleButton from "../../assets/styles/Ui.module.scss";
import { Link } from 'react-router-dom';

interface ButtonProps {
  href?: string;
  onClick?: () => void | undefined;
  children: React.ReactNode;
}

export function Button({href = '#', onClick, children}: ButtonProps): JSX.Element {
    console.log(styleButton);
    return (
      onClick ? 
      <button className={styleButton.button} onClick={onClick}>{children}</button> 
      :
      <Link className={styleButton.button} to={href}>{children}</Link>
    )
}