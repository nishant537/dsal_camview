import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import PageNotFound from './PageNotFound';
import UnauthorizedAccess from './UnauthorizedAccess';
import Login from './/main/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* <Route exact path="/surgery" element={<App view = "AddSurgery"/>} />
      <Route exact path="/surgery/:id" element={<App view = "Surgery"/>} />
      <Route exact path="/operation" element={<App view = "AddOperation"/>} />
      <Route exact path="/operation/:id" element={<App view = "Operation"/>} />
      <Route exact path="/patient" element={<App view = "AddPatient"/>} />
      <Route exact path="/patient/:id" element={<App view = "Patient"/>} />
      <Route exact path="/live_dashboard" element={<App view = "LiveDashboard"/>} />
      <Route exact path="/dashboard" element={<App view = "Dashboard"/>} /> */}
      <Route exact path="/" element={<App view = "Client"/>} /> 
      <Route exact path="/exam" element={<App view = "Exam"/>} /> 
      <Route exact path="/create_exam" element={<App view = "CreateExam"/>} /> 
      <Route exact path="/shift" element={<App view = "Shift"/>} /> 
      <Route exact path="/feature_table" element={<App view = "FeatureTable"/>} /> 
      <Route exact path="/center" element={<App view = "Center"/>} /> 
      <Route exact path="/camera" element={<App view = "Camera"/>} /> 
      <Route exact path="/provisioning/:camera_id" element={<App view = "Provisioning"/>} /> 
      <Route exact path="/alert" element={<App view = "Alert"/>} /> 
      <Route exact path="/user" element={<App view = "User"/>} /> 
      <Route exact path="/camera" element={<App view = "Camera"/>} /> 
      <Route exact path="/roi_summary" element={<App view = "ROISummary"/>} /> 
      <Route exact path="/roi_review" element={<App view = "ROIReview"/>} /> 
      <Route exact path="/alert_summary" element={<App view = "AlertSummary"/>} /> 
      <Route exact path="/ticket_summary" element={<App view = "TicketSummary"/>} /> 
      <Route exact path="/camera_health" element={<App view = "CameraHealth"/>} /> 
      <Route exact path="/training_videos" element={<App view = "TrainingVideo"/>} /> 
      <Route path="*" element={<PageNotFound/>} />
      <Route path="/login" element={<Login view="SignIn"/>} />
      <Route path="/forgot_password" element={<Login view="ForgotPassword"/>} />
    </Routes>
  </BrowserRouter>,

  document.getElementById("root")
);

reportWebVitals();
