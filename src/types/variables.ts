export enum AccountType {
    Admin = "Admin",
    Guru = "Guru",
    Siswa = "Siswa",
    Vendor = "Vendor",
    Tukang = "Tukang"
}

export enum ReportType {
    VR = "VR",
    Safety = "Safety",
    Abnormality = "Abnormality"
}

export enum ReportStatus {
    NotStarted = "NotStarted",
    InProcess = "InProcess",
    Complete = "Complete",
    Hold = "Hold"
}

export enum Campus {
    MM = "MM",
    PD = "PD",
    PATI = "PATI",
    AMI = "AMI",
    MOJO = "MOJO",
    SM = "SM",
    BBL = "BBL",
    KLTN = "KLTN",
}

export function reporttype_to_string(data: any): string {
    return data == "VR" ? "5R" : data.toString()
}

export function string_to_reporttype(data?: string): ReportType | undefined {
    if (data == "5R") return ReportType.VR;
    return Object.values(ReportType).find(value => value.toString() == data);
}

export function string_to_accounttype(data?: string): AccountType | undefined {
    return Object.values(AccountType).find(value => value.toString() == data);
}

export function string_to_reportstatus(data: string): ReportStatus | undefined {
    return Object.values(ReportStatus).find(value => value.toString() == data);
}

export function string_to_campus(data?: string): Campus | undefined {
    return Object.values(Campus).find(value => value.toString() == data);
}

export function campus_to_campuscode(campus?: Campus): string | undefined {
    return Object.keys(Campus)[Object.values(Campus).findIndex(value => value == campus)];
}

export function campuscode_to_campus(campus_code?: string): Campus | undefined {
    return Object.values(Campus)[Object.keys(Campus).findIndex(value => value == campus_code)]
}

// DATABASE MODEL
export type ReportData = {
    id: string,
    submitted_by: string,
    message: string,
    type: ReportType,
    follow_up?: AccountType,
    follow_up_name?: AccountType,
    status: ReportStatus,
    location_id?: string,
    location_name?: string,
    detail_location: string,
    pic_id?: string,
    pic_name?: string,
    created_at: string,
    report_date: string,
    due_date: string,
    campus?: Campus,
    image: string
}

export type User = {
    id: string,
    email: string,
    username: string,
    password: string,
    role: AccountType,
    created_at: string
}

export type Report_PIC = {
    id: string,
    name: string,
    created_at: string,
    campus_name: string
}

export type Report_Location = {
    id: string,
    location: string,
    created_at: string,
    campus_name: string
}


// Table variables
export const table_rows: {
    [key: string]: (keyof ReportData)
} = {
    "Tanggal": "report_date",
    "Nama Pelapor": "submitted_by",
    "Laporan": "message",
    "Lokasi": "location_name",
    "PIC": "pic_name",
    "Kategori": "type",
    "Kampus": "campus",
    "Status": "status",
}

// Other things
export const statusColorHex: Record<string, string> = {
    NotStarted: "#fca5a5", // Tailwind bg-red-300
    InProcess: "#fde047",  // Tailwind bg-yellow-300
    Complete: "#86efac",   // Tailwind bg-green-300
    Hold: "#93c5fd",       // Tailwind bg-blue-300
    Abnormality: "#f3d262",
    "5R": "#7750a5",
    Safety: "#ea8557"
};

export enum ExportOutputType {
  Excel = "Excel",
  CSV = "CSV",
}