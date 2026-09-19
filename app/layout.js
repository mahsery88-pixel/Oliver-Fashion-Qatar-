import './globals.css';

export const metadata = {
  title: 'أوليفر فاشن | فساتين سهرة قطر',
  description: 'فساتين سهرة راقية - أوليفر فاشن قطر',
};

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="ar">
      <body>{children}</body>
    </html>
  );
}
