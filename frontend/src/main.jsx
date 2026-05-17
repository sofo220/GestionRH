import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import AppLayout from './shared/AppLayout.jsx'
import ProtectedRoute from './shared/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Employees from './pages/Employees.jsx'
import EmployeeForm from './pages/EmployeeForm.jsx'
import EmployeeDetails from './pages/EmployeeDetails.jsx'
import Departments from './pages/Departments.jsx'
import Leaves from './pages/Leaves.jsx'
import Payrolls from './pages/Payrolls.jsx'
import Reports from './pages/Reports.jsx'
import Users from './pages/Users.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/payrolls" element={<Payrolls />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route index element={<Users />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
