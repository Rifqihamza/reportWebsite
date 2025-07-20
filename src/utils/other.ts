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

export function which_latest_version(version1: string, version2: string): string | null {
  const version1_value = version1.split(".").map(version_number => Number.parseInt(version_number));
  const version2_value = version2.split(".").map(version_number => Number.parseInt(version_number));

  
  let result: string | null = null;
  
  (version1_value.length <= version2_value.length ? version1_value : version2_value).forEach((value, index) => {
    if(version1_value[index] > version2_value[index]) {
      result = version1;
    }
    else if(version2_value[index] > version1_value[index]) {
      result = version2;
    }
  });

  if(result) {
    return result;
  }
  
  if(version1_value.length > version2_value.length) {
    return version1;
  }
  else if(version2_value.length > version1_value.length) {
    return version2;
  }
  
  return null;
}

export function spaces_in_camel_case(word: string): string {
  return Array.from(word).map((w, index) => ((w.toLowerCase() === w && index > 0) ? w : ` ${w}`)).join("");
}