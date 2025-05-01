import { AnyFieldApi } from "@tanstack/react-form";
import style from '../../styles/Application/index.module.scss';

export function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        field.state.meta.errors.length ? 
        <span className={style.form__error}>
          <em>{field.state.meta.errors.join(',')}</em>
        </span> : <></>
    )
  }