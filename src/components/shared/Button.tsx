import { JSX } from "react";
import styleButton from '../../styles/Shared/index.module.scss';
import { Link } from 'react-router-dom';

interface ButtonProps {
  href?: string;
  onClick?: () => void | undefined;
  children: React.ReactNode;
  className?: string;
}

export function Button({href = '#', onClick, children, className}: ButtonProps): JSX.Element {
    return (
      onClick ? 
      <button className={`${styleButton.button} ${className}`} onClick={onClick}>{children}</button> 
      :
      <Link className={`${styleButton.button} ${className}`} to={href}>{children}</Link>
    )
}