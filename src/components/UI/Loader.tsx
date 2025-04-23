import style from '../../assets/styles/Ui.module.scss';

const Loader = () => {
    return (
        <div className={style.loaderWrapper}>
            <div className={style.loader}></div>
        </div>
    )
}

export default Loader;