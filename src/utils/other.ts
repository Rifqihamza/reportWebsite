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

export function capitalize(text: string): string {
  let result = "";
  let uppercase = true;

  text.split("").forEach((char: string) => {
    if(uppercase) {
      result += char.toUpperCase();
      uppercase = false;
      return;
    }
  
    result += char;

    if(char == " ") {
      uppercase = true;
    }
  })

  return result;
}
