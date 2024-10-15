export const fetchProductDetails = async (id) => {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
};
