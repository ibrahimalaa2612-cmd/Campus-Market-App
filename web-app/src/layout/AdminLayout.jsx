import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css"; // CSS اللي ربطناه قبل كده

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const sidebarSections = [
    {
      title: "Dashboard",
      pages: [{ name: "Home", path: "/admin/dashboard" }],
    },
    {
      title: "Products",
      pages: [
        { name: "Add Product", path: "/admin/add-product" },
        { name: "View Products", path: "/admin/view-products" },
      ],
    },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        {sidebarSections.map((section, index) => (
          <div key={index} style={{ marginTop: "20px" }}>
            <p style={{ fontWeight: "bold" }}>{section.title}</p>
            {section.pages.map((page, idx) => (
              <p
                key={idx}
                onClick={() => navigate(page.path)}
              >
                {page.name}
              </p>
            ))}
          </div>
        ))}

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;