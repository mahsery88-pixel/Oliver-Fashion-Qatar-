import { supabase } from '../lib/supabaseClient';

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(*)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="logo">أوليفر فاشن<br /></div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>فساتين <em>سهرة</em> راقية</h1>
        </div>
      </section>

      <div className="container">
        <div className="section-title">
          <h2>أحدث التصاميم</h2>
        </div>

        {products.length === 0 ? (
          <p className="empty-note">
            ما في منتجات مضافة بعد — أضيفيها من لوحة التحكم على <code>/admin</code>
          </p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="product-media">
                  {p.image_url && <img src={p.image_url} alt={p.name} />}
                </div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">{p.price} ر.ق</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
