export default function loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{
        width: 64,
        height: 64,
        border: '8px solid #eaeaea',
        borderTop: '8px solid #0070f3',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ marginTop: 24, fontSize: 18, color: '#666' }}>Loading...</span>
    </div>
  );
}
