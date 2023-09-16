export function Debug(data: any) {
  return (
    <pre className="p-2 border overflow-scroll text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
