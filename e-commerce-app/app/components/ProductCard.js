import Image from 'next/image';

// don't think i used this, kinda forgot about it

/**
 * Represents a product card that displays product information.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.product - The product details.
 * @param {string} props.product.thumbnail - The URL of the product thumbnail image.
 * @param {string} props.product.title - The title of the product.
 * @param {string} props.product.description - A brief description of the product.
 * @param {number} props.product.price - The price of the product.
 * @param {number} props.product.rating - The rating of the product.
 * @param {number} props.product.stock - The available stock of the product.
 * 
 * @returns {JSX.Element} The rendered product card component.
 */
const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <p>Rating: {product.rating}</p>
      <p>In Stock: {product.stock}</p>
    </div>
  );
};

export default ProductCard;
