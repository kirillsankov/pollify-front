import { useEffect } from 'react';

export default function NotFound() {
    useEffect(() => {
        document.title = '404 - Страница не найдена';
        
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
        <div>
            <h1>404 - Страница не найдена</h1>
        </div>
    </>
  );
}