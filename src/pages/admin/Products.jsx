import AdminLayout from "../../layout/AdminLayout";
import { db, storage } from "../../firebase";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const productsCollection = collection(db, "products");

  const fetchProducts = async () => {
    const data = await getDocs(productsCollection);
    setProducts(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !price || !image) {
      alert("Please fill all fields");
      return;
    }

    try {
      const imageRef = ref(storage, "products/" + image.name);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(productsCollection, {
        name,
        price: Number(price),
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      setProducts(prev => [...prev, { id: docRef.id, name, price: Number(price), image: imageUrl }]);

      setName("");
      setPrice("");
      setImage(null);
      document.getElementById("addImageInput").value = "";

    } catch (error) {
      console.log(error);
      alert("Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
    setCurrentImageUrl(product.image);
    setEditImage(null);
  };

  const handleUpdateProduct = async (id) => {
    setIsUpdating(true);
    try {
      let imageUrlToSave = currentImageUrl;

      if (editImage) {
        const imageRef = ref(storage, "products/" + editImage.name);
        await uploadBytes(imageRef, editImage);
        imageUrlToSave = await getDownloadURL(imageRef);
      }

      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        name: editName,
        price: Number(editPrice),
        image: imageUrlToSave
      });

      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Error updating product");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <h1>Products</h1>
      <form onSubmit={handleAddProduct} style={{ marginBottom: "40px" }}>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)}/>
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="file" id="addImageInput" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Add Product</button>
      </form>

      <div>
        {products.map((product) => (
          <div key={product.id} style={{ borderBottom: "1px solid #eee", paddingBottom: "15px", marginBottom: "15px" }}>
            
            {editingId === product.id ? (
              <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  style={{ display: "block", marginBottom: "10px" }}
                />
                <input 
                  type="number" 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(e.target.value)} 
                  style={{ display: "block", marginBottom: "10px" }}
                />
                
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px" }}>Current Image:</p>
                  <img src={currentImageUrl} width="50" style={{ display: "block", marginBottom: "5px" }} />
                  <input type="file" onChange={(e) => setEditImage(e.target.files[0])} />
                </div>

                <button 
                  onClick={() => handleUpdateProduct(product.id)} 
                  disabled={isUpdating}
                  style={{ marginRight: "10px", backgroundColor: "#2ecc71", color: "white", padding: "5px 15px", border: "none", cursor: "pointer" }}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
                <button 
                  onClick={() => setEditingId(null)}
                  style={{ backgroundColor: "#95a5a6", color: "white", padding: "5px 15px", border: "none", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <img src={product.image} width="100" />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <button 
                  onClick={() => handleEditClick(product)}
                  style={{ marginRight: "10px", backgroundColor: "#3498db", color: "white", padding: "5px 15px", border: "none", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{ backgroundColor: "#e74c3c", color: "white", padding: "5px 15px", border: "none", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            )}
            
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Products;