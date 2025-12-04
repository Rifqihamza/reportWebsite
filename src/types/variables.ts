import { z } from 'zod';


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
    return Object.values(Campus)[Object.keys(Campus).findIndex(value => value == campus_code)];
}

export const ReportData_TypeGuard = z.strictObject({
    id: z.string().uuid(),
    submitted_by: z.string(),
    message: z.string(),
    type: z.nativeEnum(ReportType),
    follow_up: z.nativeEnum(AccountType).nullable(),
    follow_up_name: z.string().nullable(),
    status: z.nativeEnum(ReportStatus),
    location_name: z.string().nullable(),
    detail_location: z.string(),
    pic_name: z.string().nullable(),
    created_at: z.date().or(z.string()),
    report_date: z.date().or(z.string()),
    due_date: z.date().or(z.string()).nullable(),
    campus: z.nativeEnum(Campus),
    image: z.string(),
    image_after_finish: z.string().nullable(),
    account_name: z.string()
});
export type ReportData = z.infer<typeof ReportData_TypeGuard>;


export const User_TypeGuard = z.strictObject({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    role: z.nativeEnum(AccountType),
    created_at: z.string().transform((value) => new Date(value)),
    lowercased_username: z.string(),
    inactive: z.boolean()
});
export type User = z.infer<typeof User_TypeGuard>;

export const Report_Location_TypeGuard = z.strictObject({
    id: z.string(),
    location: z.string(),
    campus_name: z.nativeEnum(Campus),
    pic_name: z.string(),
    created_at: z.string().transform((value) => new Date(value))
});
export type Report_Location = z.infer<typeof Report_Location_TypeGuard>;

export const UserResponsibleLocation_TypeGuard = z.strictObject({
    id: z.string(),
    location: z.string(),
    responsible_user_name: z.string()
});
export type UserResponsibleLocation = z.infer<typeof UserResponsibleLocation_TypeGuard>;

export const Notification_TypeGuard = z.strictObject({
    id: z.string(),
    created_at: z.string().transform((value) => new Date(value)),
    title: z.string(),
    message: z.string(),
    isNew: z.boolean(),
    account_name: z.string()
});
export type Notification = z.infer<typeof Notification_TypeGuard>;


// Table variables
export const table_rows: {
    [key: string]: (keyof ReportData)
} = {
    "Status": "status",
    "Nama": "submitted_by",
    "PIC": "pic_name",
    "Laporan": "message",
    "Kampus": "campus",
    "Lokasi": "location_name",
    "Tanggal": "created_at",
}

export const exportable_rows: {
    [key: string]: (keyof ReportData)
} = {
    "Status": "status",
    "Kategori": "type",
    "Nama": "submitted_by",
    "PIC": "pic_name",
    "Laporan": "message",
    "Kampus": "campus",
    "Lokasi": "location_name",
    "Tanggal": "created_at",
    "Bukti Temuan": "image",
    "Bukti Selesai": "image_after_finish"
}

export const keyto_table_rows: Partial<{
    [key in (keyof ReportData)]: string
}> = {
    "status": "Status",
    "created_at": "Tanggal",
    "submitted_by": "Nama Pelapor",
    "message": "Laporan",
    "location_name": "Lokasi",
    "pic_name": "PIC",
    "type": "Kategori",
    "campus": "Kampus",
    "image": "Bukti Temuan",
    "image_after_finish": "Bukti Selesai"
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
    PDF = "PDF"
}

export const ExportOutputTitles = [
    { value: ExportOutputType.Excel, title: "Excel", icon: "excelIcon.png" },
    { value: ExportOutputType.CSV, title: "CSV", icon: "csvIcon.png" },
    { value: ExportOutputType.PDF, title: "PDF", icon: "pdfIcon.png" },
];

export enum AccountAPIPrivillage {
    AllPrivillages = "AllPrivillages",
    
    // User Related Privillage
    CreateUser = "CreateUser",
    UpdateUser = "UpdateUser",
    DeleteUser = "DeleteUser",
    GetAllUsers = "GetAllUsers",
    SettingProfile = "SettingProfile",

    // Report Related Privillage
    CreateReport = "CreateReport",
    UpdateReport = "UpdateReport",
    MarkCompeleteReport = "MarkCompeleteReport",
    DeleteReport = "DeleteReport",
    GetReport = "GetReport",
    
    // Umm Related Privillage
    ReportStatisticsPage = "ReportStatisticsPage",
    PICStatisticsPage = "PICStatisticsPage",
    ExportPage = "ExportPage",
    UsersPage = "UsersPage"
}

export const account_to_api_privillage: {
    [key in AccountType]: AccountAPIPrivillage[]
} = {
    "Admin": Object.values(AccountAPIPrivillage),
    "Guru": [
        AccountAPIPrivillage.GetAllUsers,
        AccountAPIPrivillage.CreateReport,
        AccountAPIPrivillage.GetReport,
        AccountAPIPrivillage.UpdateReport,
        AccountAPIPrivillage.SettingProfile,
        AccountAPIPrivillage.MarkCompeleteReport
    ],
    "Siswa": [
        AccountAPIPrivillage.CreateReport,
        AccountAPIPrivillage.SettingProfile
    ],
    "Vendor": [
        AccountAPIPrivillage.CreateReport
    ],
    "Tukang": [
        AccountAPIPrivillage.CreateReport
    ]
};

export const privillage_for_dashboard = [
    AccountAPIPrivillage.AllPrivillages,
    AccountAPIPrivillage.GetReport,
    AccountAPIPrivillage.GetAllUsers,
    AccountAPIPrivillage.UpdateReport,
    AccountAPIPrivillage.UpdateUser,
    AccountAPIPrivillage.DeleteReport,
    AccountAPIPrivillage.DeleteUser,
    AccountAPIPrivillage.CreateUser,
];

export function has_access_to_dashboard(role: AccountType) {
    return privillage_for_dashboard.findIndex(x => account_to_api_privillage[role].includes(x)) > -1;
}


// Menu Items (used for sidebar and welcome section)
export interface MenuItem {
    id: number;
    label: string;
    icon: string;
    description: string;
    privillage?: AccountAPIPrivillage
}

export interface MenuItemGroup {
    label: string;
    icon: string;
    items: {
        id: number;
        label: string;
        icon: string;
        description: string;
        privillage?: AccountAPIPrivillage
    }[]
}

export const menuItems: (MenuItem|MenuItemGroup)[] = [
    { 
        id: 0,
        label: "Home",
        icon: "pi pi-home",
        description: "Kembali ke menu utama untuk melihat navigasi ke tempat-tempat lain"
    },
    { 
        id: 1,
        label: "Table",
        icon: "pi pi-table",
        privillage: AccountAPIPrivillage.GetReport,
        description: "Lihat dan kelola data laporan yang disimpan"
    },
    { 
        label: "Statistics",
        icon: "pi pi-chart-pie",
        items: [
            {
                id: 2,
                label: "Report Statistics",
                icon: "pi pi-chart-line",
                privillage: AccountAPIPrivillage.ReportStatisticsPage,
                description: "Lihat dan analisa data laporan berdasarkan statistik"
            },
            {
                id: 6,
                label: "PIC Statistics",
                icon: "pi pi-chart-bar",
                privillage: AccountAPIPrivillage.PICStatisticsPage,
                description: "Lihat dan analisa PIC beserta laporan nya"
            }
        ]
    },
    { 
        id: 3,
        label: "Export",
        icon: "pi pi-file-export",
        privillage: AccountAPIPrivillage.ExportPage,
        description: "Download data yang telah terekam sistem"
    },
    { 
        id: 4,
        label: "Users",
        icon: "pi pi-user",
        privillage: AccountAPIPrivillage.UsersPage,
        description: "Lihat data pengguna yang menggunakan website ini"
    },
    { 
        id: 5,
        label: "Setting",
        icon: "pi pi-cog",
        privillage: AccountAPIPrivillage.SettingProfile,
        description: "Sesuaikan akun yang sekarang anda gunakan"
    },
];


export const max_file_size = 10;