import { useEffect, useState } from "react";
import "./PlansScreen.css";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase"; // Assuming you have a separate firebase.js file for Firebase initialization
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

const PlansScreen = () => {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const subscriptionsRef = collection(
          db,
          `customers/${user.uid}/subscriptions`
        );
        const querySnapshot = await getDocs(subscriptionsRef);

        querySnapshot.forEach((subscriptionDoc) => {
          setSubscription({
            role: subscriptionDoc.data().role,
            current_period_end:
              subscriptionDoc.data().current_period_end.seconds,
            current_period_start:
              subscriptionDoc.data().current_period_start.seconds,
          });
        });
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchSubscription();
  }, [user.uid]);

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
  console.log(subscription);

  const loadCheckout = async (priceId) => {
    if (!priceId) {
      console.error("priceId is undefined or null");
      return;
    }

    const checkoutSessionsRef = collection(
      db,
      "customers",
      user.uid,
      "checkout_sessions"
    );

    try {
      const docRef = await addDoc(checkoutSessionsRef, {
        price: priceId,
        success_url: window.location.origin,
        cancelUrl: window.location.origin,
      });

      onSnapshot(docRef, async (snap) => {
        const { error, sessionId } = snap.data();

        if (error) {
          alert(
            `Woah! There seems to be an error on our end: ${error.message}`
          );
        }
        if (sessionId) {
          const stripe = await loadStripe(
            "pk_test_51Nny4iHFZPYcuaATz1Rk5Bs9kRhSftSNdyNZtlO0eS7m1RzNJWOh0QAinSJHyuxk3pj2OweG05MGWOiSTxCuboMU00j50ghBdp"
          );
          stripe.redirectToCheckout({ sessionId });
        }
      });
    } catch (error) {
      console.error("Error adding checkout session:", error);
    }
  };

  return (
    <div className="plansScreen">
      <br />
      {subscription && (
        <p>
          Renewal date:{" "}
          {new Date(
            subscription?.current_period_end * 1000
          ).toLocaleDateString()}
        </p>
      )}
      {products.map((product) => {
        const isCurrentPackage = product.data.name
          ?.toLowerCase()
          .includes(subscription?.role);
        return (
          <div
            key={product.id}
            className={`${
              isCurrentPackage && "plansScreen__plan--disabled"
            } plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{product.data.name}</h5>
              <h6>{product.data.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(product.prices[0].priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PlansScreen;
