import ProductDetailClient from './ProductDetailClient';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  return <ProductDetailClient id={id} />;
}
