import { Navigate, Route, Routes } from 'react-router-dom';
import { CreateForm, FormInner, Stats } from "../../components/Application/index";
import { Aside } from "../../components/Layout/index";
import style from '../../styles/Application/index.module.scss';

const Application = () => {
    return (
        <div className={`${style.container} ${style.aside__container}`}>
            <Aside/>
            <>
                <Routes> 
                    <Route path="create" element={<CreateForm/>}/>
                    <Route path="stats" element={<Stats/>}/>
                    <Route path="stats/:id" element={<FormInner/>}/>
                    <Route path="edit/:id" element={<CreateForm/>}/>
                    <Route path="*" element={<Navigate to="stats" replace />} />
                </Routes>
            </>
        </div>
    )
}

export default Application;