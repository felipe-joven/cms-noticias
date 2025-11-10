import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/dashboard/AdminLayout';
import NewsList from '../components/dashboard/NewsList';
import NewsForm from '../components/dashboard/NewsForm';
import SectionManager from '../components/dashboard/SectionManager';
import '../Css/Dashboard.css';

const AdminPanel = () => {
  return (
    <div className="magical-dashboard">
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="noticias" replace />} />
          <Route path="noticias" element={<NewsList />} />
          <Route path="noticias/nueva" element={<NewsForm />} />
          <Route path="noticias/editar/:id" element={<NewsForm />} />
          <Route path="secciones" element={<SectionManager />} />
        </Routes>
      </AdminLayout>
    </div>
  );
};

export default AdminPanel;