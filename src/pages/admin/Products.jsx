import AdminLayout from "../../layout/AdminLayout";
import { db, storage } from "../../firebase";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
const Products = () => {
const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

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

  } catch (error) {
    console.log(error);
    alert("Error adding product");
  }
};

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  return (
    <AdminLayout>

      <h1>Products</h1>
      <form onSubmit={handleAddProduct}>
        <input type="text" placeholder="Product Name" onChange={(e) => setName(e.target.value)}/>
        <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">
          Add Product
        </button>
      </form>

      <div>

        {products.map((product) => (

          <div key={product.id}>

            <img src={product.image} width="100" />

            <h3>{product.name}</h3>

            <p>{product.price}</p>

            <button onClick={() => handleDeleteProduct(product.id)}>
              Delete
            </button>

          </div>

        ))}

      </div>

    </AdminLayout>
  );
};

export default Products;