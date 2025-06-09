import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { AccountType, ReportStatus, ReportType, reporttype_to_string, string_to_reporttype, type ReportData, type User, } from '../../types/variables';
import { InputTextarea } from "primereact/inputtextarea";
import { APIResultType, updateReport } from '../../utils/api_interface';
import { useReportDataHook } from "../../hooks/shared/useReportData";
import { useReportDetailHook, useReportEditHook } from "../../hooks/useReportHook";
import { useMessageToastHook } from "../../hooks/shared/useMessageToast";
import { useReportConfigHook } from "../../hooks/shared/useReportConfig";

const reportTypeOptions = [
    ...Object.keys(ReportType)
        .filter(x => x !== "NoType" && x !== "VR")
        .map(key => ({
            label: reporttype_to_string(key as ReportType) || key,
            value: key
        })),
    { label: "5R", value: "5R" }
];

// Assuming AccountType is something like a string or an enum
// We need to create options based on the possible values of AccountType
const accountTypeOptions = [
    { label: "Guru", value: AccountType.Guru },
    { label: "Siswa", value: AccountType.Siswa },
    { label: "Vendor", value: AccountType.Vendor },
    { label: "Tukang", value: AccountType.Tukang },
    // Add more options based on your AccountType definition
];

export default function ReportEditModal() {
    const { reportData, setReportData } = useReportDataHook();
    const { detailId } = useReportDetailHook();
    const { picNamesOptions, locationOptions } = useReportConfigHook();

    const report = reportData.find(value => value.id === detailId) || null;

    const [formState, setFormState] = useState({
        message: "",
        submitted_by: "",
        pic_name: "",
        location: "",
        type: "" as ReportType,
        follow_up: "" as AccountType,
        report_date: "",
        due_date: "",
        follow_up_name: "",
        status: "" as ReportStatus,
    });
    const [disableSave, setDisableSave] = useState(false);
    const [isChange, setIsChange] = useState(false);

    const { editVisible, setEditVisible } = useReportEditHook();
    const { showMessage } = useMessageToastHook();

    useEffect(() => {
        if (report) {
            setFormState({
                message: report.message || "",
                submitted_by: report.submitted_by || "",
                pic_name: report.pic_name || "",
                location: report.location || "",
                type: report.type,
                follow_up: report.follow_up || "" as AccountType, // Make sure to cast if necessary
                report_date: report.report_date,
                due_date: report.due_date || "",
                follow_up_name: report.follow_up_name || "",
                status: report.status,

            });
        }
        setIsChange(false);
    }, [report]);

    const updateField = (field: keyof typeof formState, value: any) => {
        if (field == "due_date" || field == "report_date") {
            if (value == null || value == undefined || value == "") {
                value = "";
            }
            else {
                value = (new Date(value)).toISOString()
            }
        }
        else if (field == "type") {
            value = string_to_reporttype(value);
        }
        setFormState(prev => ({ ...prev, [field]: value }));
        setIsChange(true);
    };

    const handleSave = async () => {
        if (disableSave || !report || !isChange) return;
        setDisableSave(true);


        let result: APIResultType | null;
        try {
            result = await updateReport(report.id, {
                ...report,
                ...formState // formState now includes the updated status
            } as ReportData);
        }
        catch {
            showMessage("Success", "success", "Successfully update data!");
            return;
        }
        finally {
            setDisableSave(false);
        }

        if (result === APIResultType.NoError) {
            // Update current report data information
            const updated: any = reportData.map(item =>
                item.id === report.id ? { ...item, ...formState } : item
            );
            setReportData(updated);

            // Close the dialog component and trigger success function
            setEditVisible(false)
            showMessage("Success", "success", "Successfully update data!");
        }
        else if (result === APIResultType.Unauthorized) {
            showMessage("Unauthorized", "error", "Unauthorized attempt detected!");
        }
        else if (result === APIResultType.InternalServerError) {
            showMessage("Error", "error", "There's an error!");
        }
    };

    return (
        <Dialog
            header="Edit Laporan"
            style={{ width: '80vw' }}
            visible={editVisible}
            draggable={false}
            onHide={() => setEditVisible(false)}
            footer={
                <div className="flex justify-end gap-2">
                    <button onClick={() => setEditVisible(false)} className="text-gray-800 hover:text-gray-200">Batal</button>
                    <button onClick={handleSave} disabled={disableSave || !isChange} className="text-blue-400 hover:text-gray-600 disabled:text-gray-800 disabled:opacity-50 disabled:pointer-events-none"><span className={disableSave ? "" : "hidden"}><i className="pi pi-spinner pi-spin"></i></span> Simpan</button>
                </div>
            }
        >
            <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                <div className="flex flex-col space-y-3.5 w-full">
                    <InputField label="Pelapor" value={formState.submitted_by} onChange={(e) => updateField("submitted_by", e.target.value)} />
                    <DropdownField
                        label="PIC"
                        options={picNamesOptions.map((val) => ({ label: val, value: val }))}
                        value={formState.pic_name}
                        onChange={(e) => updateField("pic_name", e.target.value)}
                    />
                    <DropdownField
                        filter
                        label="Lokasi"
                        options={locationOptions.map((val) => ({ label: val, value: val }))}
                        value={formState.location}
                        onChange={(e) => updateField("location", e.value)}
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="descriptionReport" className="font-bold">Deskripsi Laporan</label>
                    <InputTextarea rows={9} id="descriptionReport" className="w-full resize-none" value={formState.message} onChange={(e) => updateField("message", e.target.value)} />
                </div>
            </div>

            <div className="space-y-2 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2 mt-4">
                <DropdownField
                    label="Kategori"
                    options={reportTypeOptions}
                    value={reporttype_to_string(formState.type)}
                    onChange={(e) => updateField("type", e.value)}
                />
                <DropdownField
                    label="Follow Up"
                    options={accountTypeOptions} // Using the newly created options
                    value={formState.follow_up}
                    onChange={(e) => updateField("follow_up", e.value as AccountType)} // Cast the value to AccountType
                />
                <DropdownField // Add the status dropdown here
                    label="Edit Status"
                    options={Object.values(ReportStatus).map((status) => ({ label: status, value: status }))}
                    value={formState.status}
                    onChange={(e) => updateField("status", e.value)}
                />
                <InputField label="Follow Up Oleh" value={formState.follow_up_name} onChange={(e) => updateField("follow_up_name", e.target.value)} />
                <CalendarField
                    label="Tanggal Temuan"
                    value={new Date(formState.report_date)}
                    onChange={(e) => updateField("report_date", new Date(e.target.value))}
                    required={true}
                />

                <CalendarField
                    label="Due Date"
                    value={(formState.due_date != "") ? new Date(formState.due_date) : null}
                    onChange={(e) => updateField("due_date", e.target.value ? new Date(e.target.value) : "")}
                />
            </div>
        </Dialog >
    );
}

// Komponen input teks
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="font-semibold mb-1">{label}</label>
            <InputText value={value} onChange={onChange} className="w-full" />
        </div>
    );
}

// Komponen dropdown
function DropdownField({ label, options, value, onChange, filter }: {
    label: string;
    options: { label: string, value: string }[];
    value: string | AccountType; // Allow both string and AccountType
    onChange: (e: any) => void;
    filter?: boolean
}) {
    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <Dropdown className="[&_.p-dropdown-label]:text-white! [&_.p-dropdown-trigger]:text-white! bg-[#93bfcf]! [&_.p-dropdown]:bg-[#93bfcf]! [&_.p-dropdown-label]:bg-[#93bfcf]! [&_.p-dropdown-trigger]:bg-[#93bfcf]! w-full" filter value={value} options={options} onChange={onChange} placeholder={`Pilih ${label}`} />
        </div>
    );
}

function CalendarField({ label, value, onChange, required = false }: {
    label: string;
    value: Date | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean
}) {
    const inputValue = value
        ? new Date(value).toISOString().slice(0, 16) // format for datetime-local
        : "";

    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <input
                type="datetime-local"
                value={inputValue}
                onChange={onChange}
                className="p-inputtext p-component w-full"
                required={true}
            />
        </div>
    );
}
