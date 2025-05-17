import { useEffect } from 'react';
import style from '../../styles/Error/index.module.scss';

export default function NotFound() {
    useEffect(() => {
        document.title = '404 - Page Not Found';
        
        let metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        metaRobots.content = 'noindex';
        document.head.appendChild(metaRobots);
        
        let metaStatus = document.createElement('meta');
        metaStatus.name = 'status';
        metaStatus.content = '404';
        document.head.appendChild(metaStatus);
        
        return () => {
          document.head.removeChild(metaRobots);
          document.head.removeChild(metaStatus);
        };
      }, []);
    
  return (
    <>
        <div className={`${style.container} ${style.errorPage}`}>
            <h1 className={style.errorPage__title}>404</h1>
            <p className={style.errorPage__description}>Page not found</p>
        </div>
    </>
  );
}