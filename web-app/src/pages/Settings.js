import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import "../styles/Auth.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <div className="auth-container" style={{ paddingTop: "100px", minHeight: "100vh" }}>
      <div className="auth-card" style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
        
        {activeTab === "main" && (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#ffffff" }}>إعدادات الحساب</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <button 
                onClick={() => setActiveTab("password")}
                style={{ 
                  width: "100%", 
                  padding: "15px", 
                  textAlign: "right", 
                  borderRadius: "8px", 
                  border: "1px solid #ddd", 
                  background: "#fff", 
                  cursor: "pointer",
                  fontSize: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#333"
                }}
              >
                <span>🔒 تغيير كلمة المرور</span>
                <span style={{ color: "#ccc" }}>‹</span>
              </button>

              <button 
                style={{ 
                  width: "100%", 
                  padding: "15px", 
                  textAlign: "right", 
                  borderRadius: "8px", 
                  border: "1px solid #f0f0f0", 
                  background: "#f9f9f9", 
                  color: "#000000",
                  fontSize: "16px",
                  cursor: "not-allowed",
                  display: "flex",
                  justifyContent: "space-between"
                }}
                disabled
              >
                <span>🔔 الإشعارات (قريباً)</span>
              </button>
            </div>
          </>
        )}

        {activeTab === "password" && (
          <>
            <button 
              onClick={() => setActiveTab("main")}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#3498db", 
                cursor: "pointer", 
                marginBottom: "20px", 
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "right",
                width: "100%"
              }}
            >
              ← العودة للقائمة الرئيسية
            </button>
            
            <div style={{ color: "#333" }}>
              <ChangePassword />
            </div>
          </>
        )}

        <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#999" }}>  Campus Market v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;