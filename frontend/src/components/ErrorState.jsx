function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested data.",
  onRetry,
}) {
  return (
    <div className="page-state error-state">
      <div className="error-icon">!</div>

      <h2>{title}</h2>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;