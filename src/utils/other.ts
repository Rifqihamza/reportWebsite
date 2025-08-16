import strftime from "strftime";

export function date_to_str(date: Date | string | null): string {
  if(!date) return "";
  if(typeof date === "string") date = new Date(date);

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

export function seconds_to_time_obj(duration_in_seconds: number) {
  let seconds = duration_in_seconds;
  let minutes = 0;
  let hours = 0;
  let days = 0;
  let weeks = 0;
  let months = 0;
  
  while (seconds > 60) {
    seconds -= 60;
    minutes += 1;
  }

  while (minutes > 60) {
    minutes -= 60;
    hours += 1;
  }

  while (hours > 24) {
    hours -= 24;
    days += 1;
  }

  while (days > 7) {
    days -= 7;
    months += 1;
  }

  while (weeks > 4) {
    weeks -= 4;
    months += 1;
  }

  return {
    seconds: seconds,
    minutes: minutes,
    hours: hours,
    days: days,
    weeks: weeks,
    months: months,
  };
}

export function seconds_to_general_time(duration_in_seconds: number) {
  const time_obj = seconds_to_time_obj(duration_in_seconds);
  let result: string = "";

  if(time_obj.months) {
    result += time_obj.months + " bulan ";
  }

  if(time_obj.weeks) {
    result += time_obj.weeks + " minggu ";
  }

  if(time_obj.days) {
    result += time_obj.days + " hari ";
  }

  if(time_obj.hours) {
    result += time_obj.hours + " jam ";
  }

  if(time_obj.minutes) {
    result += time_obj.minutes + " menit ";
  }

  if(time_obj.seconds) {
    result += time_obj.seconds + " detik ";
  }
  
  return result;
}