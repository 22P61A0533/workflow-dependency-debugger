function EmptyState({
  title = "No data found",
  message = "There is nothing to display right now.",
}) {
  return (
    <div className="page-state empty-state">
      <div className="empty-icon">○</div>

      <h2>{title}</h2>

      <p>{message}</p>
    </div>
  );
}

export default EmptyState;