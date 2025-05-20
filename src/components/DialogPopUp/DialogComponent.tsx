import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { useEffect, useState } from "react";
import { ReportType, reporttype_to_string, type ReportData, type User, } from '../../types/variables';
import { AccountType } from "@prisma/client";
import { InputTextarea } from "primereact/inputtextarea";

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

export default function DialogComponent({
    reportData,
    detailId,
    visible,
    setVisible,
    setReportData
}: {
    userData: User | null,
    reportData: ReportData[],
    setReportData: React.Dispatch<React.SetStateAction<ReportData[]>>,
    dateFilter: (Date | null)[],
    searchKeyword: string,
    detailId: string | number | null,
    visible: boolean,
    setVisible: (val: boolean) => void
}) {
    const report = reportData.find(value => value.id === detailId) || null;

    const [formState, setFormState] = useState({
        message: "",
        submitted_by: "",
        pic_name: "",
        location: "",
        type: "" as ReportType,
        follow_up: "" as AccountType,
        report_date: null as Date | null,
        due_date: null as Date | null,
        follow_up_name: "",

    });

    useEffect(() => {
        if (report) {
            setFormState({
                message: report.message || "",
                submitted_by: report.submitted_by || "",
                pic_name: report.pic_name || "",
                location: report.location || "",
                type: report.type,
                follow_up: report.follow_up || "" as AccountType, // Make sure to cast if necessary
                report_date: report.report_date ? new Date(report.report_date) : null,
                due_date: report.due_date ? new Date(report.due_date) : null,
                follow_up_name: report.follow_up_name || "",

            });
        }
    }, [report]);

    const updateField = (field: keyof typeof formState, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Simpan perubahan ke state reportData
        if (!report) return;
        const updated: any = reportData.map(item =>
            item.id === report.id ? { ...item, ...formState } : item
        );
        setReportData(updated);
        setVisible(false);
    };

    return (
        <Dialog
            className="rounded-[50px]!"
            header="Edit Laporan"
            style={{ width: '80vw', borderRadius: "40px", }}
            visible={visible}
            draggable={false}
            onHide={() => setVisible(false)}
            footer={
                <div className="flex justify-end gap-2">
                    <button onClick={() => setVisible(false)} className="p-button p-button-text">Batal</button>
                    <button onClick={handleSave} className="p-button p-button-primary">Simpan</button>
                </div>
            }
        >
            <div>
                <div>
                    <label htmlFor="descriptionReport" className="font-bold">Deskripsi Laporan</label>
                    <InputTextarea id="descriptionReport" className="w-full resize-none" value={formState.message} onChange={(e) => updateField("message", e.target.value)} />
                </div>
                <div className="space-y-2 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
                    <InputField label="Pelapor" value={formState.submitted_by} onChange={(e) => updateField("submitted_by", e.target.value)} />
                    <InputField label="PIC" value={formState.pic_name} onChange={(e) => updateField("pic_name", e.target.value)} />
                    <InputField label="Lokasi" value={formState.location} onChange={(e) => updateField("location", e.target.value)} />
                    <DropdownField
                        label="Kategori"
                        options={reportTypeOptions}
                        value={formState.type}
                        onChange={(e) => updateField("type", e.value)}
                    />
                    <DropdownField
                        label="Follow Up"
                        options={accountTypeOptions} // Using the newly created options
                        value={formState.follow_up}
                        onChange={(e) => updateField("follow_up", e.value as AccountType)} // Cast the value to AccountType
                    />
                    <InputField label="Follow Up Oleh" value={formState.follow_up_name} onChange={(e) => updateField("follow_up_name", e.target.value)} />
                    <CalendarField label="Tanggal Temuan" value={formState.report_date} onChange={(e) => updateField("report_date", e.value)} />
                    <CalendarField label="Due Date" value={formState.due_date} onChange={(e) => updateField("due_date", e.value)} />
                </div>
            </div>
        </Dialog>
    );
}

// Komponen input teks
function InputField({ label, value, onChange }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <InputText value={value} onChange={onChange} className="w-full" />
        </div>
    );
}

// Komponen dropdown
function DropdownField({ label, options, value, onChange }: {
    label: string;
    options: { label: string, value: string }[];
    value: string | AccountType; // Allow both string and AccountType
    onChange: (e: any) => void;
}) {
    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <Dropdown value={value} options={options} onChange={onChange} className="w-full" placeholder={`Pilih ${label}`} />
        </div>
    );
}

// Komponen calendar
function CalendarField({ label, value, onChange }: {
    label: string;
    value: Date | null;
    onChange: (e: any) => void;
}) {
    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <Calendar value={value} onChange={onChange} className="w-full" showTime hourFormat="24" />
        </div>
    );
}