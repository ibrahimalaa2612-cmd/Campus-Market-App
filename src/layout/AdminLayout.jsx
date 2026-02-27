import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", background: "#eee", padding: "10px" }}>
        <h3>Admin Panel</h3>
        <p>Dashboard</p>
        <p>Users</p>
      </aside>
      <main style={{ flex: 1, padding: "20px" ,display:"flex",flexDirection:"column,",justifyContent:"center",alignItems:"center"}}>
        <button onClick={handleLogout}>Logout</button>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;