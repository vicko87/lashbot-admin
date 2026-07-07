import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Availability from "./pages/Availability";
import Clients from "./pages/Clients";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";
import WhatsApp from "./pages/WhatsApp";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/availability" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/availability" element={
          <PrivateRoute><Navbar /><Availability /></PrivateRoute>} />
        <Route path="/clients" element={
          <PrivateRoute><Navbar /><Clients /></PrivateRoute>}
           />
           <Route path="*" element={<Navigate to="/availability" />} />
           <Route path="/whatsapp" element={<PrivateRoute><Navbar /><WhatsApp /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><Navbar /><Appointments /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}