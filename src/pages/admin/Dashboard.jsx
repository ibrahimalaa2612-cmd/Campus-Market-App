import AdminLayout from "../../layout/AdminLayout";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();

const handleLogout = async () => {
  await signOut(auth);
  navigate("/admin/login");
};
return(
  <AdminLayout>
    <h1>Welcome__Admin </h1>
    
  </AdminLayout>
);
};

export default Dashboard;