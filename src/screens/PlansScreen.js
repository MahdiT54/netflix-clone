import { useEffect, useState } from "react";
import "./PlansScreen.css";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have a separate firebase.js file for Firebase initialization
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

const PlansScreen = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = [];

      try {
        const productQuery = query(
          collection(db, "products"),
          where("active", "==", true)
        );
        const querySnapshot = await getDocs(productQuery);

        for (const productDoc of querySnapshot.docs) {
          const productData = productDoc.data();

          // Fetch price data
          const priceQuery = query(collection(productDoc.ref, "prices"));
          const priceQuerySnapshot = await getDocs(priceQuery);
          const priceData = priceQuerySnapshot.docs.map((price) => ({
            priceId: price.id,
            priceData: price.data(),
          }));

          productsData.push({
            id: productDoc.id,
            data: productData,
            prices: priceData,
          });
        }

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  console.log(products);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancelUrl: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        alert(`Woah! There seems to be an error on our end: ${error.message}`);
      }
      if (sessionId) {
        const stripe = await loadStripe(
          "pk_test_51Nny4iHFZPYcuaATz1Rk5Bs9kRhSftSNdyNZtlO0eS7m1RzNJWOh0QAinSJHyuxk3pj2OweG05MGWOiSTxCuboMU00j50ghBdp"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };

  return (
    <div className="plansScreen">
      {products.map((product) => (
        <div key={product.id} className="plansScreen__plan">
          <div className="plansScreen__info">
            <h5>{product.data.name}</h5>
            <h6>{product.data.description}</h6>
          </div>
          <button onClick={() => loadCheckout(product.data.priceId)}>
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
};

export default PlansScreen;