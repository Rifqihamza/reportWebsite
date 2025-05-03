const base_url_endpoint: string = "http://localhost:8000";

// Useful enum!
export enum APIResultType {
    NoError = "No Error",
    Unauthorized = "Unauthorized",
    InternalServerError = "Internal Server Error"
}

export enum AccountType {
    Guru = "Guru",
    Siswa = "Siswa",
    Vendor = "Vendor"
}

export enum ReportType {
    VR = "5R",
    Safety = "Safety",
    SOP = "SOP"
}

// DATABASE MODEL
export type ReportData = {
    id: string,
    message: string,
    type: ReportType,
    follow_up: AccountType,
    status: ReportStatus,
    pic_name: string
}



enum ReportStatus {
    Pending,
    OnProgress,
    Completed
}


// Backend Functionalities
export async function userLogin(username: string, password: string): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/user/login", {
        method: "POST",
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

export async function addReport(message: string, pic_name: string, report_type: ReportType,  follow_up: string): Promise<APIResultType> {
    // Fetch to API
    const response = await fetch(base_url_endpoint + "/api/report/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "message": message,
            "pic_name": pic_name,
            "report_type": report_type,
            "follow_up": follow_up
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