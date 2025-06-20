import strftime from "strftime";

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  // Format date part
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `${formattedDate}, ${strftime("%H:%M", date)}`;
}
