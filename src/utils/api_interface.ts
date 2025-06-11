import { AccountType, ReportType, ReportStatus } from '../types/variables';
import type { Campus, Report_Location, Report_PIC, ReportData, User } from "../types/variables";
import imageCompression from 'browser-image-compression';

const base_url_endpoint: string = "";

// Useful enum!
export enum APIResultType {
    NoError = "No Error",
    Unauthorized = "Unauthorized",
    NeedCaptchaAuthentication = "Need Captcha Authentication",
    InternalServerError = "Internal Server Error",
    DatabaseError = "Database Error"
}

// Backend Functionalities
export async function userLogin(username: string, password: string): Promise<APIResultType | AccountType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });

    // Check the response
    if (response.ok) {
        const role = (await response.json()).role;
        const result = string_to_accounttype(role);
        if (!result) {
            alert("There's something unexpected. Please send this code to the dev. error code: 001");
            return APIResultType.NoError;
        }

        return result;
    }
    else if (response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else if (response.status == 503) {
        return APIResultType.DatabaseError
    }
    else {
        return APIResultType.Unauthorized;
    }
}

function add_to_formdata(formData: FormData, key: string, value?: string) {
    if (value) {
        formData.append(key, value);
    }
}

export async function addReport(
    submitted_by: string,
    message: string,
    report_type: ReportType,
    pic_name?: string,
    follow_up?: AccountType,
    follow_up_name?: string,
    location?: string,
    detail_location?: string,
    report_date?: string,
    due_date?: string,
    image?: File,
    campus?: Campus
): Promise<APIResultType | ReportData> {
    // Setting up Form Data
    const form_data = new FormData();

    add_to_formdata(form_data, "submitted_by", submitted_by)
    add_to_formdata(form_data, "message", message);
    add_to_formdata(form_data, "report_type", report_type);
    add_to_formdata(form_data, "pic_name", pic_name)
    add_to_formdata(form_data, "follow_up", follow_up);
    add_to_formdata(form_data, "follow_up_name", follow_up_name);
    add_to_formdata(form_data, "location", location);
    add_to_formdata(form_data, "detail_location", detail_location);
    add_to_formdata(form_data, "report_date", report_date);
    add_to_formdata(form_data, "due_date", due_date);
    add_to_formdata(form_data, "campus", campus);

    if (image) {
        const compressed_image = await imageCompression(image, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        });

        form_data.append("image", compressed_image);
    }

    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/add", {
        method: "POST",
        credentials: "include",
        body: form_data,
    });

    // Check the response
    if (response.ok) {
        return (await response.json()) as ReportData;
    }
    else if (response.status == 401) {
        return APIResultType.Unauthorized;
    }
    else {
        return APIResultType.InternalServerError;
    }
}


export async function getReport(campus: string): Promise<ReportData[] | APIResultType> {
    const response = await fetch(`/api/report/get?campus=${campus}`, {
        method: "GET",
        credentials: "include",
    });

    if (response.ok) {
        let result = (await response.json()) as ReportData[];
        result = result.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf());
        return result;
    } else if (response.status === 500) {
        return APIResultType.InternalServerError;
    } else {
        return APIResultType.Unauthorized;
    }
}

export async function checkAuthentication(): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/", {
        method: "GET",
        credentials: "include",
    });

    switch (response.status) {
        case 511:
            return APIResultType.NeedCaptchaAuthentication;
        case 500:
            return APIResultType.InternalServerError;
        case 503:
            return APIResultType.DatabaseError;
        case 401:
            return APIResultType.Unauthorized;
        default:
            return APIResultType.NoError;
    }
}

export async function changeReportStatus(report_id: string, report_status: ReportStatus): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/change_status", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "report_id": report_id,
            "report_status": report_status
        })
    });

    // Check the response
    if (response.ok) {
        return APIResultType.NoError;
    }
    else if (response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
    }
}


export async function deleteReport(report_id: string): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "report_id": report_id
        })
    });

    // Check the response
    if (response.ok) {
        return APIResultType.NoError;
    }
    else if (response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
    }
}

export async function userLogout(): Promise<boolean> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/user/logout", {
        method: "POST",
        credentials: "include",
    });

    // Check the response
    return response.ok;
}

export async function getUser(): Promise<User | APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/user/get", {
        method: "GET",
        credentials: "include",
    });

    if (response.ok) {
        return (await response.json()) as User;
    }
    else if (response.status == 401) {
        return APIResultType.Unauthorized;
    }

    return APIResultType.InternalServerError;
}

export async function updateReport(report_id: string, report_data: ReportData) {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/update", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "report_id": report_id,
            "report_data": report_data
        })
    });

    // Check the response
    if (response.ok) {
        return APIResultType.NoError;
    }
    else if (response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
    }
}

export type formConfigurationResponse = {
    pic_data: Report_PIC[],
    location_data: Report_Location[]
}

export async function getFormConfiguration(selectedCampus: Campus) {
    // Fetch to API
    const response = await fetch(`${base_url_endpoint}/api/report_form/configuration/?campus=${selectedCampus}`, {
        method: "GET",
        credentials: "include",
    });

    if (response.ok) {
        return (await response.json()) as formConfigurationResponse;
    }
    else if (response.status == 401) {
        return APIResultType.Unauthorized;
    }

    return APIResultType.InternalServerError;
}

export function string_to_reporttype(data: string): ReportType | undefined {
    return Object.values(ReportType).find(value => value.toString() == data);
}

export function string_to_accounttype(data: string): AccountType | undefined {
    return Object.values(AccountType).find(value => value.toString() == data);
}

export function string_to_reportstatus(data: string): ReportStatus | undefined {
    return Object.values(ReportStatus).find(value => value.toString() == data);
}