const Forbidden = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>403</h1>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>
  );
};

export default Forbidden;