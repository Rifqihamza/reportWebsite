import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { AccountType, ReportStatus, ReportType, reporttype_to_string } from "../../../../types/variables";
import { APIResultType, updateReport } from "../../../../utils/api_interface";
import { useReportDataHook } from "../../../../hooks/shared/useReportData";
import { useReportDetailHook, useReportEditHook } from "../../../../hooks/pages/ReportTable/useReportHook";
import { useMessageToastHook } from "../../../../hooks/shared/useMessageToast";
import UseReportConfigHookEffect, { useReportConfigHook } from "../../../../hooks/shared/useReportConfig";
import { Calendar } from "primereact/calendar";
import { useNetworkConnectivityHook } from "../../../../hooks/shared/useNetworkConnectivity";
import { PrimeReactProvider } from "primereact/api";
import DropdownComponent from "../../../GlobalComponents/DropdownComponent/DropdownComponent";
import { spaces_in_camel_case } from "../../../../utils/other";
import { useReportCompletionHook } from "../../../../hooks/pages/ReportTable/useReportCompletionHook";

const accountTypeOptions = Object.values(AccountType).map((type) => {
  return {
    label: type.toString(),
    value: type
  }
});

const reportStatusOptions = Object.values(ReportStatus).map((status) => {
  return {
    label: spaces_in_camel_case(status.toString()),
    value: status
  }
});

export default function ReportEditModal() {
  const { reportData, setReportData } = useReportDataHook();
  const { detailId } = useReportDetailHook();
  const { picNamesOptions } = useReportConfigHook();
  const { setReportId } = useReportCompletionHook();

  const report = reportData?.find((value) => value.id === detailId) || null;

  const [formState, setFormState] = useState({
    pic_name: "",
    follow_up: "" as AccountType,
    due_date: "",
    follow_up_name: "",
    status: "" as ReportStatus,
  });
  const [disableSave, setDisableSave] = useState(false);
  const [isChange, setIsChange] = useState(false);

  const { editVisible, setEditVisible } = useReportEditHook();
  const { showMessage, showMessageByAPI } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    if (report) {
      setFormState({
        pic_name: report.pic_name || "",
        follow_up: report.follow_up || ("" as AccountType),
        due_date: (report.due_date || "").toString(),
        follow_up_name: report.follow_up_name || "",
        status: report.status || "",
      });
    }
    setIsChange(false);
  }, [report]);

  const updateField = (field: keyof typeof formState, value: any) => {
    if (field === "due_date") {
      value = value ? new Date(value).toISOString() : "";
    }
    setFormState((prev) => ({ ...prev, [field]: value }));
    setIsChange(true);
  };

  const handleSave = async () => {
    if(!report) return;
    
    if (formState.status === ReportStatus.Complete) {
      setReportId(report.id);
      return;
    }
    
    if (!isConnected) {
      showMessage("Internet koneksi terputus.", "error", "Mohon coba lagi setelah terkoneksi internet");
    }

    if (disableSave || !report || !isChange) return;
    setDisableSave(true);

    let result: APIResultType | false;
    try {
      result = await updateReport(report.id, formState);
    } catch {
      showMessageByAPI(APIResultType.NoError, "Data berhasil diedit!");
      return;
    } finally {
      setDisableSave(false);
    }

    if(result === false) {
      showMessage("Terjadi error.", "error");
    }
    else if (result === APIResultType.NoError) {
      // Update current report data information
      const updated: any = reportData?.map((item) => (item.id === report.id ? { ...item, ...formState } : item)) || null;
      setReportData(updated);

      // Close the dialog component and trigger success function
      setEditVisible(false);
      showMessageByAPI(result, "Data berhasil diedit!");
    } else if (result === APIResultType.Unauthorized) {
      showMessageByAPI(result, "Unauthorized attempt detected!");
    } else if (result === APIResultType.InternalServerError) {
      showMessageByAPI(result, "Terjadi error!");
    } else if (result === APIResultType.DatabaseError) {
      showMessageByAPI(result, "Database sedang bermasalah. Mohon tunggu, lalu coba lagi!");
    } else {
      showMessageByAPI(result);
    }
  };

  
  return (
    <>
      <UseReportConfigHookEffect />
      <PrimeReactProvider>
        <Dialog
          header="Edit Laporan"
          className="w-full max-w-6xl"
          visible={editVisible}
          draggable={false}
          onHide={() => setEditVisible(false)}
          footer={
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditVisible(false)} className="text-gray-800 hover:text-gray-200">
                Batal
              </button>
              <button onClick={handleSave} disabled={disableSave || !isChange} className="text-blue-400 hover:text-gray-600 disabled:text-gray-800 disabled:opacity-50 disabled:pointer-events-none">
                {disableSave && <i className="pi pi-spinner pi-spin mr-2" />}
                Simpan
              </button>
            </div>
          }
        >
          <div className="w-full grid grid-rows-2 grid-cols-2 gap-2">
            {(() => {
              const picNameIsNotLoaded = Object.values(picNamesOptions).length == 0;
              return (
                <DropdownField
                  label="PIC"
                  options={report?.campus && !picNameIsNotLoaded ? picNamesOptions[report.campus].map((val) => ({ label: val, value: val })) : []}
                  value={formState.pic_name}
                  onChange={(e) => updateField("pic_name", e.target.value)}
                  disabled={picNameIsNotLoaded}
                  filter
                />
              );
            })()}
            <CalendarField label="Due Date" value={formState.due_date ? new Date(formState.due_date) : null} onChange={(e) => updateField("due_date", e.value ? new Date(e.value) : "")} />
            <DropdownField label="Follow Up" options={accountTypeOptions} value={formState.follow_up} onChange={(e) => updateField("follow_up", e.value as AccountType)} />
            <InputField label="Nama Follow Up" value={formState.follow_up_name} onChange={(e) => updateField("follow_up_name", e.target.value)} max={30} />
          </div>
          <DropdownField label="Status" options={reportStatusOptions} value={formState.status} onChange={(e) => updateField("status", e.value as ReportStatus)} />
        </Dialog>
      </PrimeReactProvider>
    </>
  );
}

// Input Text Field
function InputField({
  label,
  value,
  onChange,
  disabled = false,
  max = 191,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  max?: number;
}) {
  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-between px-2">
        <label className="font-semibold mb-1">{label}</label>
        {disabled ? (
          <p className="text-gray-400">
            <i className="pi pi-lock"></i>
          </p>
        ) : (
          ""
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="outline-none px-4 py-2 border border-gray-400 focus:border-gray-800 rounded-lg disabled:border-gray-300"
        disabled={disabled}
        maxLength={max}
      />
    </div>
  );
}

// Komponen dropdown
function DropdownField({
  label,
  options,
  value,
  onChange,
  disabled,
  filter,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string | AccountType;
  onChange?: (e: any) => void;
  disabled?: boolean;
  filter?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-2">
        <label className="font-semibold mb-1">{label}</label>
        {disabled ? (
          <p className="text-gray-400">
            <i className="pi pi-lock"></i>
          </p>
        ) : (
          ""
        )}
      </div>
      <DropdownComponent
        filter={filter}
        disabled={disabled}
        value={value}
        options={options}
        onChange={onChange}
        label={label}
      />
    </div>
  );
}

// Calendar Field
function CalendarField({ label, value, onChange, disabled = false }: { label: string; value: Date | null; onChange?: (e: any) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between px-2">
        <label className="font-semibold mb-1">{label}</label>
        {disabled ? (
          <p className="text-gray-400">
            <i className="pi pi-lock"></i>
          </p>
        ) : (
          ""
        )}
      </div>

      <Calendar value={value} onChange={onChange} showTime className="outline-none! px-4! border! border-gray-400! focus:border-gray-800! rounded-lg!" disabled={disabled} />
    </div>
  );
}
