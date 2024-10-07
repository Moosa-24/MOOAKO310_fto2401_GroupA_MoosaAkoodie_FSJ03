import { db } from "../../utils/firebase"; // Adjust the import path
import { collection, addDoc } from "firebase/firestore";

export async function POST(request) {
    const productData = await request.json();

    try {
        const docRef = await addDoc(collection(db, "products"), productData);
        return new Response(JSON.stringify({ id: docRef.id }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error uploading product data" }), { status: 500 });
    }
}
