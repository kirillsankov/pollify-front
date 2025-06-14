import React from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CreateForm, FormInner, Stats } from "../../components/Application/index";
import { Aside } from "../../components/Layout/index";
import style from '../../styles/Application/index.module.scss';

const Application = () => {
    return (
        <>
            <Helmet>
                <title>Dashboard - Pollify</title>
                <meta name="description" content="Manage your polls, view statistics, and create new surveys in your Pollify dashboard." />
            </Helmet>
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
        </>
    )
}

export default Application;