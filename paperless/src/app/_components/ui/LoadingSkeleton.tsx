export default function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div
      className="flex flex-col items-center py-10"
      role="status"
      aria-live="polite"
    >
      <p className="text-brand-light animate-pulse">{text}</p>
    </div>
  );
}
