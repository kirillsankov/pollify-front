import React from 'react';
import { Helmet } from 'react-helmet-async';
import style from '../../styles/Error/index.module.scss';

export default function NotFound() {
    
  return (
    <>
        <Helmet>
            <title>404 - Page Not Found - Pollify</title>
            <meta name="description" content="The page you are looking for could not be found. Return to Pollify homepage or try a different URL." />
            <meta name="robots" content="noindex" />
        </Helmet>
        <div className={`${style.container} ${style.errorPage}`}>
            <h1 className={style.errorPage__title}>404</h1>
            <p className={style.errorPage__description}>Page not found</p>
        </div>
    </>
  );
}