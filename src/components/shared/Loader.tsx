import style from '../../styles/Shared/index.module.scss';


const Loader = () => {
    return (
        <div className={style.loaderWrapper}>
            <div className={style.loader}></div>
        </div>
    )
}

export default Loader;