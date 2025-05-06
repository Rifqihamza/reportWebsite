import type { AccountType, ReportData, ReportStatus, ReportType, User } from "../types/variables";

const base_url_endpoint: string = "http://localhost:4321";

// Useful enum!
export enum APIResultType {
    NoError = "No Error",
    Unauthorized = "Unauthorized",
    InternalServerError = "Internal Server Error"
}


// Backend Functionalities
export async function userLogin(username: string, password: string): Promise<APIResultType> {
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
    if(response.ok) {
        return APIResultType.NoError;
    }
    else if(response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
    }
}

export async function addReport(message: string, pic_name: string, report_type: ReportType,  follow_up: AccountType, follow_up_name: string, location?: string, report_date?: string, due_date?: string): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/add", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "message": message,
            "pic_name": pic_name,
            "report_type": report_type,
            "follow_up": follow_up,
            "location": location,
            "report_date": report_date,
            "due_date": due_date,
            "follow_up_name": follow_up_name
        })
    });

    // Check the response
    if(response.ok) {
        return APIResultType.NoError;
    }
    else if(response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
    }
}

export async function getReport(): Promise<ReportData[]|APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/get", {
        method: "GET",
        credentials: "include",
    });

    // Check the response
    if(response.ok) {
        return (await response.json()) as ReportData[];
    }
    else if(response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
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
    if(response.ok) {
        return APIResultType.NoError;
    }
    else if(response.status == 500) {
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
    if(response.ok) {
        return APIResultType.NoError;
    }
    else if(response.status == 500) {
        return APIResultType.InternalServerError;
    }
    else {
        return APIResultType.Unauthorized;
    }
}

export async function getPIC(): Promise<User[]|APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/pic/get", {
        method: "GET",
        credentials: "include",
    });

    // Check the response
    if(response.ok) {
        return (await response.json()) as User[];
    }
    else if(response.status == 500) {
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


export async function getUser(): Promise<User|APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/user/get", {
        method: "POST",
        credentials: "include",
    });

    if(response.ok) {
        return (await response.json()) as User;
    }
    else if (response.status == 401) {
        return APIResultType.Unauthorized;
    }
 
    return APIResultType.InternalServerError;
}