export function SaveFeedback({ isError }: { isError: boolean }) {
  if (!isError) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      Could not save your change. Please try again.
    </p>
  );
}
