
import './App.css';
import { useAuth0} from '@auth0/auth0-react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HRDashboard from './components/HR_dash/HRDashboard';
import CustomerPage from './components/Candidate/CustomerPage';
import UploadResume from './components/Candidate/UploadResume';
import JobCreation from './components/HR_dash/JobCreation/JobCreation';
import { useEffect } from 'react';
import ShortlistedCandidates from './components/HR_dash/shortlist/shortlist';
import { ToastContainer } from 'react-toastify';
const allowedDomains=["citchennai.net"];
function App() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const getUserDomain = (email) => email.split("@")[1];

  const isAuthorized = user && allowedDomains.includes(getUserDomain(user.email));
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect only when logging in, but not on every render
    if (isAuthenticated) {
      if (window.location.pathname === "/") {
        navigate(isAuthorized ? "/hr-dashboard" : "/");
      }
    }
  }, [isAuthenticated, isAuthorized, navigate]);
  
  return (
    <div className='app'>
      <Navbar isAuthorized={isAuthorized}/>
      <ToastContainer />
      {/* {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Sign In</button>
      ) :  */}
      <Routes>
      {isAuthorized ? (
        <>
          <Route path="/hr-dashboard" element={<><HRDashboard/></>} />
        <Route path="/hr-dashboard/create-job" element={<><JobCreation /></>} />
        <Route path="/hr-dashboard/job/:jobId" element={<><ShortlistedCandidates/></>} />
      
        </>
      ) : (
        <>
          <Route path="/" element={<CustomerPage />} />
          <Route path="/upload/:jobId" element={<UploadResume />} />
        </>
      )}
      </Routes>
      {/* } */}
    </div>
  );
}

export default App;
