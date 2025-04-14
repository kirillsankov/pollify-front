import { JSX } from "react";
import styleButton from "../../assets/styles/Ui.module.scss";
import { Link } from 'react-router-dom';

interface ButtonProps {
  href?: string;
  text?: string;
}

export function Button({href = '#', text = "button"}: ButtonProps): JSX.Element {
    console.log(styleButton);
    return (
        <Link className={styleButton.button} to={href}>{text}</Link>
    )
}