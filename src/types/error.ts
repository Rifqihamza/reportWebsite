import type { ToastMessage } from "primereact/toast";
import type { APIResultType } from "../utils/api_interface";

export const error_message: {
  [key in APIResultType]: {
    title: string,
    detail: string,
    severity: ToastMessage["severity"]
  }
} = {
  "No Error": {
    title: "Sukses!",
    detail: "",
    severity: "success"
  },
  "Internal Server Error": {
    title: "Terjadi kesalahan dari sisi server",
    detail: "Silahkan coba lagi nanti",
    severity: "error"
  },
  "Need Captcha Authentication": {
    title: "Dibutuhkan authentikasi CAPTCHA",
    detail: "Silahkan reload browser anda.",
    severity: "error"
  },
  "Unauthorized": {
    title: "Tidak mempunyai akses",
    detail: "Anda tidak memiliki akses ke fitur ini",
    severity: "error"
  },
  "Database Error": {
    title: "Terjadi error database",
    detail: "Database sedang mengalami masalah. Silahkan coba beberapa saat.",
    severity: "warn"
  },
  "Conflict": {
    title: "Terjadi konflik!",
    detail: "",
    severity: "warn"
  },
  "RateLimited": {
    title: "Terdeteksi spam!",
    detail: "Maaf, Silahkan tunggu beberapa menit untuk mengguanakan website ini lagi.",
    severity: "error"
  },
  "Data Mismatch": {
    title: "Data tidak sesuai!",
    detail: "Maaf, Silahkan tunggu beberapa menit untuk mengguanakan website ini lagi.",
    severity: "error"
  }
}