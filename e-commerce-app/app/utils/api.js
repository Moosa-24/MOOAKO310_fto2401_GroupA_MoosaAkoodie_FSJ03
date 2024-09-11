export async function getProducts(limit = 20, skip = 0) {
    const res = await fetch(`https://next-ecommerce-api.vercel.app/products?limit=${limit}&skip=${skip}`);
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return await res.json();
  }