import style from '../assets/styles/Footer.module.scss'


export function Footer() {
    return (
        <footer className={style.footer}>
            <div className={`${style.container} ${style.footer__container}`}>
                <div className={style.footer__textContainer}>
                    <p>Create by</p>
                    <a className={style.link} target="_blank" href="https://github.com/kirillsankov" rel="noreferrer">Kirill Sankov</a>
                </div>
            </div>
        </footer>
    )
}