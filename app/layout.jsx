import "./globals.css";

export const metadata = {
  title: "Chem Lab Studio",
  description: "面向中学生的化学实验分层学习网站"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
