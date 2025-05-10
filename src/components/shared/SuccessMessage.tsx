import { Button } from "./Button";
import style from  "../../styles/Shared/index.module.scss";

interface Props {
  onClick: () => void;
  title: string;
  description: string;
  buttonText: string;
}

const SuccessMessage = ({ onClick, title, description, buttonText }: Props) => (
    <div className={style.shared}>
      <h2 className={style.shared__title}>{title}</h2>
      <p className={style.shared__description}>{description}</p>
      <Button className={style.shared__button} onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );

  export default SuccessMessage;