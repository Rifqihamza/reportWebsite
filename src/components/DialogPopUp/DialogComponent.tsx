import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { ReportType, reporttype_to_string, type ReportData, type User, } from '../../types/variables';

const reportTypeOptions = [
    ...Object.keys(ReportType)
        .filter(x => x !== "NoType" && x !== "VR")
        .map(key => ({
            label: reporttype_to_string(key as ReportType) || key,
            value: key
        })),
    { label: "5R", value: "5R" }
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
        follow_up: "",
        report_date: null as Date | null,
        due_date: null as Date | null,
    });

    useEffect(() => {
        if (report) {
            setFormState({
                message: report.message || "",
                submitted_by: report.submitted_by || "",
                pic_name: report.pic_name || "",
                location: report.location || "",
                type: report.type,
                follow_up: report.follow_up || "",
                report_date: report.report_date ? new Date(report.report_date) : null,
                due_date: report.due_date ? new Date(report.due_date) : null,
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
            <div className="space-y-2 grid lg:grid-cols-2 grid-cols-1 lg:gap-4 gap-2">
                <InputField label="Deskripsi Laporan" value={formState.message} onChange={(e) => updateField("message", e.target.value)} />
                <InputField label="Pelapor" value={formState.submitted_by} onChange={(e) => updateField("submitted_by", e.target.value)} />
                <InputField label="PIC" value={formState.pic_name} onChange={(e) => updateField("pic_name", e.target.value)} />
                <InputField label="Lokasi" value={formState.location} onChange={(e) => updateField("location", e.target.value)} />
                <DropdownField
                    label="Kategori"
                    options={reportTypeOptions}
                    value={formState.type}
                    onChange={(e) => updateField("type", e.value)}
                />
                <InputField label="Follow Up" value={formState.follow_up} onChange={(e) => updateField("follow_up", e.target.value)} />
                <CalendarField label="Tanggal Temuan" value={formState.report_date} onChange={(e) => updateField("report_date", e.value)} />
                <CalendarField label="Due Date" value={formState.due_date} onChange={(e) => updateField("due_date", e.value)} />
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
    value: string;
    onChange: (e: any) => void;
}) {
    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-1">{label}</label>
            <Dropdown value={value} options={options} onChange={onChange} className="w-full" placeholder="Pilih kategori" />
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
