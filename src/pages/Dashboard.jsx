// import { useAuth } from '../hooks/useAuth';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await logout();
//       // Send the user back to the login terminal window on sign-out
//       navigate('/login');
//     } catch (error) {
//       console.error("Failed to log out correctly", error);
//     }
//   };

//   return (
//     <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
//         <h2>System Dashboard</h2>
//         <button 
//           onClick={handleLogout} 
//           style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}
//         >
//           Sign Out
//         </button>
//       </div>

//       <div style={{ marginTop: '30px', background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
//         <h3>Welcome back, {user?.name}! 👋</h3>
//         <p>You have securely authenticated into the main interface portal.</p>
        
//         <div style={{ marginTop: '20px', background: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #e3e6f0' }}>
//           <h4>Your Account Session Parameters:</h4>
//           <ul>
//             <li><strong>User Identity ID:</strong> {user?.id}</li>
//             <li><strong>Registered Profile Name:</strong> {user?.username}</li>
//             <li><strong>Email System Destination:</strong> {user?.email}</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;