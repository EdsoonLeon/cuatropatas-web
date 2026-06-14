export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-destructive text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm underline text-muted-foreground"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
