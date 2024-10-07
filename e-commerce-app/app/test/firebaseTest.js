// app/test/firebaseTest.js

"use client"; // This line makes it a client component
import { useEffect } from "react";
import { db } from "../utils/firebaseConfig"; // Adjust the path according to your structure
import { collection, getDocs } from "firebase/firestore"; // Import necessary functions

const FirebaseTest = () => {
  useEffect(() => {
    const checkFirestoreConnection = async () => {
      try {
        // Reference to the "products" collection
        const productsCollection = collection(db, "products");
        
        // Fetch documents from the collection
        const snapshot = await getDocs(productsCollection);
        
        console.log('Snapshot:', snapshot); // Log the snapshot for debugging

        // Check if the snapshot is empty
        if (snapshot.empty) {
          console.log("No products found in Firestore.");
        } else {
          console.log("Firestore connection is working. Found products:");
          
          // Iterate through the documents and log their data
          snapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
          });
        }
      } catch (error) {
        // Log any errors encountered while connecting to Firestore
        console.error("Error connecting to Firestore:", error);
      }
    };

    checkFirestoreConnection();
  }, []);

  return <div>Check the console for Firebase connection status.</div>;
};

export default FirebaseTest;
