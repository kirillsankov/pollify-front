import { Route, Routes } from 'react-router-dom';
import CreateForm from "../components/CreateForm";
import Stats from "../components/Stats";
import style from '../assets/styles/Application.module.scss'
import Aside from "../components/UI/Aside";

const Application = () => {
    return (
        <div className={`${style.container} ${style.aside__container}`}>
            <Aside/>
            <>
                <Routes> 
                    <Route path="create" element={<CreateForm/>}/>
                    <Route path="stats" element={<Stats/>}/>
                </Routes>
            </>
        </div>
    )
}

export default Application;