export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>lots_management</h1>
      <p>Next.js 起動OK</p>
      <ul>
        <li><a href="/master/items">品目マスタ</a></li>
        <li><a href="/movements/receive">入庫</a></li>
        <li><a href="/movements/issue">出庫</a></li>
        <li><a href="/movements/transfer">拠点振替</a></li>
        <li><a href="/stocks">在庫一覧</a></li>
        <li><a href="/monthly">月次費用振替</a></li>
        <li><a href="/uniforms">制服管理</a></li>
      </ul>
    </main>
  );
}
