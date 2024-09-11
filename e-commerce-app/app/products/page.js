import { getProducts } from '../utils/api';
import styles from './products.module.css';

export default async function ProductsPage() {
  try {
    const products = await getProducts(); // Fetch products (limit and skip are optional)
    
    return (
      <div>
        <h1>Products</h1>
        <div className={styles.productsGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <p>Failed to load products: {error.message}</p>;
  }
}
