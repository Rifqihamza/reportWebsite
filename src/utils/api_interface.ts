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
    DatabaseError = "Database Error",
    Conflict = "Conflict",
    RateLimited = "RateLimited",
}

function status_to_apiresult(status: number): APIResultType {
    switch (status) {
        case 511:
            return APIResultType.NeedCaptchaAuthentication;
        case 500:
            return APIResultType.InternalServerError;
        case 503:
            return APIResultType.DatabaseError;
        case 401:
            return APIResultType.Unauthorized;
        case 409:
            return APIResultType.Conflict
        case 429:
            return APIResultType.RateLimited
        default:
            return APIResultType.NoError;
    }
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
    
    return status_to_apiresult(response.status);
}

function add_to_formdata(formData: FormData, key: string, value?: string | Blob) {
    if (value) {
        formData.append(key, value);
    }
}

export async function addReport(
    submitted_by: string,
    message: string,
    report_type: ReportType,
    location?: string,
    detail_location?: string,
    report_date?: string,
    image?: File,
    campus?: Campus
): Promise<APIResultType | ReportData> {
    // Setting up Form Data
    const form_data = new FormData();

    add_to_formdata(form_data, "submitted_by", submitted_by)
    add_to_formdata(form_data, "message", message);
    add_to_formdata(form_data, "report_type", report_type);
    add_to_formdata(form_data, "location", location);
    add_to_formdata(form_data, "detail_location", detail_location);
    add_to_formdata(form_data, "report_date", report_date);
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
    else if (response.status == 503) {
        return APIResultType.DatabaseError;
    }
    else {
        return APIResultType.InternalServerError;
    }
}


export async function getReport(): Promise<ReportData[] | APIResultType> {
    // Fetch to API
    const response = await fetch(`${base_url_endpoint}/api/report/get`, {
        method: "GET",
        credentials: "include",
    });

    
    const api_result = status_to_apiresult(response.status);
    if(api_result === APIResultType.NoError) {
        // Sorting report data by date
        let result = (await response.json()) as ReportData[];
        result = result.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf());
        return result;
    }

    return api_result;
}

export async function addUser(data: {username: string, password: string, role: AccountType}): Promise<APIResultType|User> {
    // Fetch API
    const response = await fetch(`${base_url_endpoint}/api/user/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const api_result = status_to_apiresult(response.status);
    if(api_result === APIResultType.NoError) {
        return (await response.json()) as User;
    }

    return api_result;
}

export async function checkAuthentication(): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/", {
        method: "GET",
        credentials: "include",
    });
    
    return status_to_apiresult(response.status);
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

    return status_to_apiresult(response.status);
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


    const api_result = status_to_apiresult(response.status);
    if(api_result === APIResultType.NoError) {
        return (await response.json()) as User;
    }

    return api_result;
}
export async function getAllUsers(): Promise<User[] | false | APIResultType> {
    let response;
    try {
        response = await fetch(base_url_endpoint + "/api/user/allUsers", {
            method: "GET",
            credentials: "include"
        })
    }
    catch (err) {
        return false;
    }


    const api_result = status_to_apiresult(response.status);
    if(api_result === APIResultType.NoError) {
        return (await response.json()) as User[];
    }

    return api_result;
}

export async function updateUser(userId: string, data: { username: string; password: string }): Promise<APIResultType | User | false> {
    try {
        const response = await fetch(`/api/user/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: userId,
                username: data.username,
                password: data.password,
            }),
        });

        
        const api_result = status_to_apiresult(response.status);
        if(api_result === APIResultType.NoError) {
            return (await response.json()) as User;
        }

        return api_result;
    } catch (error) {
        return false;
    }
}


type updatedDataType = {
    pic_name: string,
    follow_up: AccountType,
    due_date: string,
    follow_up_name: string,
    status: ReportStatus,
};

export async function updateReport(report_id: string, updated_data: updatedDataType): Promise<APIResultType | false> {
    // Fetch to API
    try {
        const response = await fetch(base_url_endpoint + "/api/report/update", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "report_id": report_id,
                "report_data": updated_data
            })
        });

        return status_to_apiresult(response.status);
    }
    catch(err) {
        return false;
    }
}

export async function markCompleteReport(report_id: string, confirmation_photo: File): Promise<false | APIResultType | ReportData> {
    const formData = new FormData();

    add_to_formdata(formData, "report_id", report_id);
    add_to_formdata(formData, "confirmation_photo", confirmation_photo);
    
    // Fetch to API
    try {
        const response = await fetch(base_url_endpoint + "/api/report/complete", {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const result = status_to_apiresult(response.status);

        if(result === APIResultType.NoError) {
            return (await response.json()) as ReportData;
        }

        return result;
    }
    catch(err) {
        return false;
    }
}

export type formConfigurationResponse = {
    pic_data: Report_PIC[],
    location_data: Report_Location[]
}

export async function getFormConfiguration(): Promise<APIResultType | formConfigurationResponse | false> {
    // Fetch to API
    let response;
    try {
        response = await fetch(`${base_url_endpoint}/api/report_form/configuration/`, {
            method: "GET",
            credentials: "include",
        });
    }
    catch (err) {
        return false;
    }

        
    const api_result = status_to_apiresult(response.status);
    if(api_result === APIResultType.NoError) {
        return (await response.json()) as formConfigurationResponse;
    }

    return api_result;
}

export async function deleteUser(id: string): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/user/delete", {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "id": id
        })
    });

    return status_to_apiresult(response.status);
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