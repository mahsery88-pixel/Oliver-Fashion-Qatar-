'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sizesInput, setSizesInput] = useState('40,42,44,46,48,50');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, product_sizes(*)')
      .order('created_at', { ascending: false });
    setProducts(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('جاري الإضافة...');

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      setMessage('صار خطأ: ' + error.message);
      return;
    }

    const sizes = sizesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const sizeRows = sizes.map((size) => ({
      product_id: product.id,
      size,
      sold_out: false,
    }));

    await supabase.from('product_sizes').insert(sizeRows);

    setMessage('تمت إضافة الفستان بنجاح ✅');
    setName('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    loadProducts();
  }

  async function toggleSoldOut(sizeId, current) {
    await supabase
      .from('product_sizes')
      .update({ sold_out: !current })
      .eq('id', sizeId);
    loadProducts();
  }

  async function deleteProduct(id) {
    if (!confirm('متأكدة تبين تحذفي هالفستان؟')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24, fontFamily: 'Cairo, sans-serif' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif' }}>لوحة إدارة أوليفر فاشن</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        <label>اسم الفستان
          <input value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        </label>

        <label>السعر (ر.ق)
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} />
        </label>

        <label>وصف مختصر
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
        </label>

        <label>رابط الصورة (من Supabase Storage أو أي رابط مباشر)
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={inputStyle} />
        </label>

        <label>المقاسات (مفصولة بفاصلة)
          <input value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} style={inputStyle} />
        </label>

        <button type="submit" style={buttonStyle}>إضافة الفستان</button>
        {message && <p>{message}</p>}
      </form>

      <h2>الفساتين الحالية ({products.length})</h2>
      {products.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <strong>{p.name}</strong>
            <button onClick={() => deleteProduct(p.id)} style={{ color: 'red', border: 'none', background: 'none' }}>حذف</button>
          </div>
          <div>{p.price} ر.ق</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {p.product_sizes?.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSoldOut(s.id, s.sold_out)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  background: s.sold_out ? '#f2c2c2' : '#e8f5e8',
                }}
              >
                {s.size} {s.sold_out ? '(نفذ)' : ''}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginTop: 4,
  borderRadius: 4,
  border: '1px solid #ccc',
  fontFamily: 'inherit',
};

const buttonStyle = {
  padding: '12px',
  background: '#c08a3e',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  fontWeight: 'bold',
  cursor: 'pointer',
};
