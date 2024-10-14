export async function getProducts(limit = 20, page = 1) {
  const res = await fetch(`/api/products?limit=${limit}&page=${page}`);
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return await res.json();
}

  