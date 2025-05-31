export function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  // Format date part
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format time part without "pukul"
  const formattedTime = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
}
