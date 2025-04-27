import { Navigate, Route, Routes } from 'react-router-dom';
import CreateForm from "../components/CreateForm";
import Stats from "../components/Stats";
import style from '../assets/styles/Application.module.scss'
import Aside from "../components/UI/Aside";
import FormInner from '../components/FormInner';

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