import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Cart.css";

const DEFAULT_IMAGE = "https://i.postimg.cc/FKMdfByG/download.jpg";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>السلة فارغة 🛒</h2>
          <p>أضف بعض المنتجات لتبدأ التسوق</p>
          <button onClick={() => navigate("/")} className="back-btn">
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>سلة التسوق ({totalItems} منتج)</h1>
        <div className="cart-actions">
          <span className="cart-total">الإجمالي: {totalPrice.toLocaleString()} EGP</span>
          <button className="clear-btn" onClick={clearCart}>مسح السلة</button>
        </div>
      </div>

      <div className="cart-list">
        {cart.map((item) => (
          <div key={item.id} className="cart-card" onClick={() => navigate(`/product/${item.id}`)}>
            <img
              src={item.image || DEFAULT_IMAGE}
              alt={item.name}
              className="cart-card-img"
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
            <div className="cart-card-info">
              <h3>{item.name}</h3>
              <p className="cart-card-price">{item.price.toLocaleString()} EGP</p>
              <p className="cart-card-seller">{item.sellerName}</p>
              <p className="cart-card-condition">{item.condition}</p>
            </div>
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(item.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}