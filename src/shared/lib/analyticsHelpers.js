/** Centralizes shared analytics helpers rules and data helpers for backend features. */
/** Builds the ordered six-month window used to label analytics reports. */
export function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
      label: start.toLocaleString("en-US", { month: "short" }),
      start,
      end: new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999),
    });
  }
  return months;
}

/** Groups timestamped records into monthly counts for dashboard charts. */
export function buildMonthlyCount(months, records, dateKey = "createdAt") {
  const map = Object.fromEntries(months.map((m) => [m.key, 0]));
  for (const record of records) {
    const date = new Date(record[dateKey]);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (key in map) map[key] += 1;
  }
  return months.map((m) => ({ month: m.label, value: map[m.key] }));
}

/** Converts a stored status value to a display label for analytics. */
export function formatStatusLabel(status) {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/** Converts aggregated metrics into chart-ready slices. */
export function toChartSlices(rows, statusKey = "status") {
  return rows.map((row) => ({
    name: formatStatusLabel(row[statusKey]),
    key: String(row[statusKey] || "unknown").toLowerCase(),
    value: row._count[statusKey],
  }));
}
