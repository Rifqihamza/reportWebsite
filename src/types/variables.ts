export enum AccountType {
    NoType = "",
    Guru = "Guru",
    Siswa = "Siswa",
    Vendor = "Vendor"
}

export enum ReportType {
    VR = "5R",
    Safety = "Safety",
    Abnormality = "Abnormality"
}

export enum ReportStatus {
    NotStarted="NotStarted",
    InProcess="InProcess",
    Complete="Complete",
    Hold="Hold"
}

export function reporttype_to_string(data: any): string {
    return data == ReportType.VR ? "5R" : data.toString()
}

export function string_to_reporttype(data: string): ReportType|undefined {
    return Object.values(ReportType).find(value => value.toString() == data);
}

export function string_to_accounttype(data: string): AccountType|undefined {
    return Object.values(AccountType).find(value => value.toString() == data);
}

export function string_to_reportstatus(data: string): ReportStatus|undefined {
    return Object.values(ReportStatus).find(value => value.toString() == data);
}

// DATABASE MODEL
export type ReportData = {
    id: string,
    message: string,
    type: ReportType,
    follow_up: AccountType,
    status: ReportStatus,
    location: string,
    pic_name: string,
    created_at: string,
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