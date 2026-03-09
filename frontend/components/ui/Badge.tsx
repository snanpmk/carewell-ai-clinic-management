import { clsx } from "clsx";

type Severity = "mild" | "moderate" | "severe";

const colorMap: Record<Severity, string> = {
  mild: "bg-green-100 text-green-700 border-green-200",
  moderate: "bg-amber-100 text-amber-700 border-amber-200",
  severe: "bg-red-100 text-red-700 border-red-200",
};

export function Badge({ label }: { label: Severity }) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full px-3 py-0.5 text-xs font-semibold border capitalize",
        colorMap[label]
      )}
    >
      {label}
    </span>
  );
}
