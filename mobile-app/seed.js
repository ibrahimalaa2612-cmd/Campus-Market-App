// const { initializeApp } = require("firebase/app");
// const { getFirestore, collection, addDoc, Timestamp } = require("firebase/firestore");

// بيانات مشروعك (Campus Market)
// const firebaseConfig = {
//   apiKey: "AIzaSyBDL-E_GCH7eRGfF_MdQ3cSuQA5wgPt8Ds",
//   authDomain: "campus-market-d381e.firebaseapp.com",
//   projectId: "campus-market-d381e",
//   storageBucket: "campus-market-d381e.appspot.com",
//   messagingSenderId: "967405445457",
//   appId: "1:967405445457:web:5d2d7321ae6a6c26a53370",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // 40 منتج بأسماء وصور احترافية (تم تغيير name لـ title ليتوافق مع كود الويب)
// const baseProducts = [
//   { title: "آلة حاسبة Casio 991ARX", price: 1450, category: "Electronics", image: "https://images.unsplash.com/photo-1594818821917-cf729a5ec6c2?w=800" ,seller: "ibrahim@gmail.com" },
//   { title: "لاب توب Dell Gaming", price: 32000, category: "Laptops", image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800" ,seller: "ibrahim@gmail.com"},
//   { title: "كتاب كيمياء هندسية", price: 190, category: "Books", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800" ,seller: "ibrahim@gmail.com"},
//   { title: "شنطة ظهر واسعة", price: 750, category: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",seller: "ibrahim@gmail.com" },
//   { title: "ماوس وايرلس Logitech", price: 1100, category: "Electronics", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",seller: "ibrahim@gmail.com" },
//   { title: "طقم أدوات هندسية", price: 480, category: "Engineering", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",seller: "ibrahim@gmail.com" },
//   { title: "سماعة عازلة للضوضاء", price: 2100, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",seller: "ibrahim@gmail.com" },
//   { title: "نوت بوك سلك A5", price: 90, category: "Stationery", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800" ,seller: "ibrahim@gmail.com"},
//   { title: "بور بانك Anker 20k", price: 1850, category: "Electronics", image: "https://images.unsplash.com/photo-1609091839311-d5368196c0ff?w=800",seller: "ibrahim@gmail.com" },
//   { title: "بالطو أبيض طبى", price: 380, category: "Medical", image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800",seller: "ibrahim@gmail.com" },
//   { title: "كتاب رياضيات متقدمة", price: 250, category: "Books", image: "https://images.unsplash.com/photo-1543003919-a9957004b7f9?w=800" ,seller: "ibrahim@gmail.com"},
//   { title: "ايباد ابل الجيل العاشر", price: 15500, category: "Electronics", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",seller: "ibrahim@gmail.com" },
//   { title: "أقلام رسم فنية روتورنج", price: 220, category: "Engineering", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",seller: "ibrahim@gmail.com" },
//   { title: "سماعة AirPods", price: 8500, category: "Electronics", image: "https://images.unsplash.com/photo-1588423770574-910ae26c8595?w=800" ,seller: "mstfydwam64@gmail.com"},
//   { title: "ماك بوك برو M2", price: 48000, category: "Laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" ,seller: "mstfydwam64@gmail.com"},
//   { title: "لوحة مفاتيح ميكانيكية", price: 1350, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83aca2?w=800" ,seller: "mstfydwam64@gmail.com"},
//   { title: "فلاش ميموري 128 جيجا", price: 180, category: "Electronics", image: "https://images.unsplash.com/photo-1618410320928-25228d811631?w=800" ,seller: "mstfydwam64@gmail.com"},
//   { title: "منظم مكتب خشبي", price: 350, category: "Stationery", image: "https://images.unsplash.com/photo-1596460107916-430662021049?w=800" ,seller: "mstfydwam64@gmail.com"},
//   { title: "زمزمية حرارية ستانلس", price: 280, category: "Accessories", image: "https://images.unsplash.com/photo-1602143303410-fd3d3953d710?w=800",seller: "mstfydwam64@gmail.com" },
//   { title: "أباجورة مكتب LED", price: 420, category: "Stationery", image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800" ,seller: "mstfydwam64@gmail.com"}
// ];

// async function seed() {
//     console.log("🚀 جاري رفع 100 منتج (بصيغة Title و Timestamp)...");
//     const colRef = collection(db, "products");

//     for (let i = 0; i < 100; i++) {
//         const base = baseProducts[i % baseProducts.length];
//         const product = {
//             title: `${base.title} - نسخة #${i + 1}`,
//             price: base.price,
//             category: base.category,
//             image: base.image,
//             description: "منتج متاح بحالة ممتازة للمعاينة داخل الحرم الجامعي.",
//             status: "approved",
//             createdAt: Timestamp.now(), // الحل السحري لمشكلة سطر 29
//             sellerEmail: base.seller,
//         };

//         try {
//             await addDoc(colRef, product);
//             console.log(`[${i+1}/100] تم بنجاح: ${product.title}`);
//         } catch (e) {
//             console.error("❌ خطأ في الرفع: ", e);
//         }
//     }
//     console.log("✨ مبروك! الداتا جاهزة والويب هيفتح معاك دلوقتي.");
//     process.exit();
// }

// seed();