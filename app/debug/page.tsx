export default async function DebugPage() {
  const secret = process.env.JWT_ACCESS_SECRET;
  
  return (
    <>
    <div>
      <h1>Debug Page-1111</h1>
      <p>JWT_ACCESS_SECRET exists: {secret ? "YES" : "NO"}</p>
      <p>Length: {secret?.length}</p>
      <p>First 5 chars: {secret?.substring(0, 5)}</p>
      <p>Last 5 chars: {secret?.substring((secret?.length || 0) - 5)}</p>
      <p>Char codes: {secret?.split('').map(c => c.charCodeAt(0)).join(',')}</p>
    </div>
     <div>
      <h1>JWT Secret Check</h1>
      <p>Exists: {secret ? "✅ YES" : "❌ NO"}</p>
      <p>Length: {secret?.length} characters</p>
      <p>Should be: 68 characters</p>
      <p>First 10 chars: {secret?.substring(0, 10)}...</p>
      <p>Last 10 chars: ...{secret?.substring((secret?.length || 0) - 10)}</p>
      <p>Full secret (first 30): {secret?.substring(0, 30)}...</p>
    </div>
</>
  );
}