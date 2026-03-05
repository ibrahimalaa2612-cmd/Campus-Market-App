/*
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
       
        {children}
      </main>
      
    </div>
  );
};

export default AdminLayout;*/

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const sidebarSections = [
    {
      title: "Dashboard",
      pages: [{ name: "Home", path: "/admin/dashboard" }],
    },
    {
      title: "Users / Products",
      pages: [
        { name: "Add Product", path: "/admin/add-product" },
        { name: "View Products", path: "/admin/view-products" },
      ],
    },
  ];

  return (
    
    <div style={{ display: "flex" ,minHeight: "100vh",backgroundColor: "#2c3e50",color:"white"}}>
      <aside style={{ width: "220px", background: "#2c3e50", padding: "20px" }}>
        <h3 style={{color: "#f1c40f"}}>Admin Panel</h3>
        {sidebarSections.map((section, index) => (
          <div key={index} style={{ marginTop: "20px" }}>
            <p style={{ fontWeight: "bold" }}>{section.title}</p>
            {section.pages.map((page, idx) => (
              <p key={idx}style={{ cursor: "pointer", marginLeft: "10px" }}onClick={() => navigate(page.path)} >  {page.name} </p> ))} 
          </div> ))}

      </aside>

      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
};

export default AdminLayout;