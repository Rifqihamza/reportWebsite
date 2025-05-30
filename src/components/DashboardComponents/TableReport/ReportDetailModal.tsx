import React from 'react';
import { Image } from 'primereact/image';
import { AccountType, reporttype_to_string, type ReportData, type User } from '../../../types/variables';
import { useFormatDate, statusColors } from '../../../hooks/useReportHooks';

interface ReportDetailModalProps {
    detailId: string | null;
    reportData: ReportData[];
    userData: User | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onEdit: () => void;
    deleteDisabled: boolean;
    saveDisabled: boolean;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
    detailId,
    reportData,
    userData,
    onClose,
    onDelete,
    onEdit,
    deleteDisabled,
    saveDisabled
}) => {
    const { formatDate } = useFormatDate();
    const report_data = reportData.find(value => value.id === detailId) || null;

    const ImageComponent = () => (
        <div className="flex flex-col justify-center items-center w-fit h-fit">
            <Image
                src={report_data?.image}
                imageClassName="object-contain rounded-lg"
                alt="Foto Bukti Laporan"
                preview={true}
                width="800"
            />
            <p className="mx-auto text-xs mt-2">Klik Gambar Untuk Melihat Preview </p>
        </div>
    );

    return (
        <>
            {/* Modal backdrop */}
            <div className={`bg-black/50 z-10 h-full fixed top-0 left-0 right-0 bottom-0 duration-1000 transition-opacity ${!detailId && "hidden"}`} />

            {/* Modal content */}
            <div className={(detailId ? "visible pointer-events-auto bottom-0" : "invisible pointer-events-none -bottom-[50rem]") +
                " left-1/2 translate-y-[1rem] -translate-x-1/2 duration-1000 fixed bg-white w-full max-w-[90vw] lg:max-w-[85vw] h-fit " +
                "lg:max-h-[100vh] max-h-[90vh] p-8 rounded-t-3xl z-10 flex flex-col space-y-5"}>

                {/* Close Button Modal */}
                <div className="absolute top-4 right-4 md:top-7 md:right-7">
                    <button className="cursor-pointer" onClick={onClose}>
                        <i className="pi pi-times p-2"></i>
                    </button>
                </div>

                {/* Header Laporan */}
                <div className="flex flex-col px-0 py-0 lg:px-6 lg:py-2">
                    <h1 className="font-bold lg:text-2xl text-lg text-black tracking-wide">Details Temuan</h1>
                    <p>Status:
                        <span className={`${report_data ? statusColors[report_data.status] : ""} md:text-md md:px-2 md:py-1 text-xs p-1.5 rounded-xl h-fit w-fit whitespace-nowrap`}>
                            {report_data?.status}
                        </span>
                    </p>
                </div>

                <div className="mt-4 flex flex-col md:flex-row gap-6 mx-4 h-full overflow-auto">
                    {/* Image Render */}
                    <div>
                        {report_data?.image ? <ImageComponent /> : <h1 className="opacity-50">Tidak ada gambar untuk laporan ini.</h1>}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 w-full flex flex-col">
                        {/* Description Laporan */}
                        <div className="flex flex-col items-start">
                            <h1 className="text-xl font-bold tracking-wide">Deskripsi Laporan</h1>
                            <p className="break-all">{report_data?.message}</p>
                        </div>
                        <hr />

                        {/* Report Details */}
                        <DetailField label="Pelapor:" value={report_data?.submitted_by} />
                        <DetailField label="Lokasi:" value={report_data?.location + (report_data?.detail_location ? (", " + report_data?.detail_location) : "")} />
                        <DetailField label="Kategori:" value={report_data ? reporttype_to_string(report_data.type)! : ""} />
                        <DetailField label="Follow Up:" value={report_data?.follow_up} fallback="Belum ditentukan" />
                        <DetailField label="Nama PIC:" value={report_data?.pic_name} fallback="Belum ditentukan" />
                        <DetailField label="Tanggal Temuan:" value={report_data ? formatDate(report_data.report_date) : "N/A"} />
                        <DetailField label="Due Date:" value={report_data ? formatDate(report_data.due_date) : null} fallback="Belum ditentukan" />
                        <DetailField label="Follow Up Oleh:" value={report_data?.follow_up_name} fallback="Belum ditentukan" />
                    </div>
                    {/* End Details */}
                </div>

                {/* Action Buttons */}
                {userData && (userData.role === AccountType.Guru || userData.role === AccountType.Vendor) && (
                    <div className="grid grid-cols-2 gap-4 w-full pt-4">
                        <button
                            className="disabled:opacity-50 flex items-center justify-center gap-1 w-full px-2 py-3 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="disabled:opacity-50 flex items-center justify-center gap-1 w-full px-2 py-3 text-white rounded-xl bg-[#7FA1C3] hover:bg-[#6FA9E3] duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                            onClick={() => report_data ? onDelete(report_data.id) : null}
                            disabled={saveDisabled || deleteDisabled}
                        >
                            {deleteDisabled && <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem', marginRight: '10px' }}></i>}
                            Hapus
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

// Helper component for detail fields
const DetailField: React.FC<{ label: string; value?: string | null; fallback?: string }> = ({
    label,
    value,
    fallback
}) => (
    <div className="flex flex-col md:flex-row justify-baseline md:justify-between">
        <h1 className="font-semibold tracking-wide">{label}</h1>
        <p className={value ? "" : "opacity-50"}>
            {value || fallback || 'N/A'}
        </p>
    </div>
);

export default ReportDetailModal;
