import { Link } from 'react-router-dom';
import styles from '../assets/styles/Home.module.scss';

interface FeatureProps {
    title: string;
    description: string;
    linkText: string;
    linkTo: string;
    imageSrc: string;
    imageAlt: string;
    isReversed?: boolean;
}

export const Feature = ({
    title,
    description,
    linkText,
    linkTo,
    imageSrc,
    imageAlt,
    isReversed = false
}: FeatureProps) => {
    return (
        <div className={`${styles.feature} ${isReversed ? styles.feature__reverse : ''}`}>
            <div className={styles.feature__content}>
                <h2 className={styles.feature__title}>{title}</h2>
                <p className={styles.feature__description}>{description}</p>
                <Link to={linkTo} className={styles.link}>
                    {linkText}
                </Link>
            </div>
            <div className={styles.feature__image}>
                <img 
                    src={imageSrc} 
                    alt={imageAlt} 
                    className={styles.feature__img}
                />
            </div>
        </div>
    );
};