/**
 * Fetches the details of a product by its ID.
 *
 * @async
 * @function fetchProductDetails
 * @param {string} id - The ID of the product to fetch details for.
 * @returns {Promise<Object>} - A promise that resolves to the product details as a JSON object.
 * @throws {Error} - Throws an error if the fetch operation fails.
 */
export const fetchProductDetails = async (id) => {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
};
