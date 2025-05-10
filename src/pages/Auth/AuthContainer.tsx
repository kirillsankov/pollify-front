import style from '../../styles/Application/index.module.scss';


interface Props {
  children: React.ReactNode;
  title: string;
}

const AuthContainer = ({ children, title }: Props) => {

  return (
    <div className={`${style.container} ${style.form__container}`}>
      <div className={style.form__block}>
          <h1 className={style.form__title}>{title}</h1>
          {children}
      </div>
    </div>
  );
};

export default AuthContainer;