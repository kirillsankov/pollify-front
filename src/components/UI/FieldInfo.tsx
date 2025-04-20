import { AnyFieldApi } from "@tanstack/react-form";
import style from '../../assets/styles/Form.module.scss';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
      <span className={style.form__error}>
        <em>{field.state.meta.errors.join(',')}</em>
      </span>
    )
  }