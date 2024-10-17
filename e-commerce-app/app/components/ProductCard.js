import Image from 'next/image';

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
