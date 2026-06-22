import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Availability from "./pages/Availability";
import Clients from "./pages/Clients";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./pages/Register";





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
      </Routes>
    </BrowserRouter>
  );
}