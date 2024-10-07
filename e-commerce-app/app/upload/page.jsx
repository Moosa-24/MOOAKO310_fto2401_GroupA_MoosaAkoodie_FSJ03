"use client";

import { useState } from "react";

export default function UploadProduct() {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        images: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Product uploaded with ID: ${data.id}`);
            setProduct({
                name: "",
                description: "",
                price: 0,
                category: "",
                stock: 0,
                images: [],
            });
        } else {
            alert("Error uploading product");
        }
    };

    return (
        <div>
            <h1>Upload Product</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={product.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={product.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={product.stock}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="images"
                    placeholder="Image URLs (comma separated)"
                    value={product.images.join(",")}
                    onChange={(e) => handleChange({ target: { name: 'images', value: e.target.value.split(",") }})}
                />
                <button type="submit">Upload Product</button>
            </form>
        </div>
    );
}
