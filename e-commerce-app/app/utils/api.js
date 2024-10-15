/**
 * Fetches a list of products from the API.
 *
 * @param {number} [limit=20] - The maximum number of products to fetch.
 * @param {number} [page=1] - The page number to retrieve products from.
 * @returns {Promise<Object[]>} A promise that resolves to an array of products.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
export async function getProducts(limit = 20, page = 1) {
  const res = await fetch(`/api/products?limit=${limit}&page=${page}`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return await res.json();
}
