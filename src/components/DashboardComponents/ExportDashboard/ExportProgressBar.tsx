import { PrimeReactProvider } from "primereact/api";
import { ProgressBar } from "primereact/progressbar";
import { useExportHook } from "../../../hooks/pages/Export/useExportHook";

export default function ExportProgressBar() {
  const { processingState, currentExportStep, maxExportStep, otherOption, selectedRows } = useExportHook();

  return (
    <PrimeReactProvider>
      <div className={`mt-6 bg-[#374151]! flex flex-row items-center gap-2 ${processingState ? "opacity-100" : "opacity-0"}`}>
        <ProgressBar
          value={Math.round((currentExportStep / maxExportStep) * 100)}
          showValue={true}
          className={`w-full ${selectedRows.includes("image") && !otherOption.usingLinkInsteadOfImage ? "[&_.p-progressbar-value-animate]:duration-500!" : ""} [&_.p-progressbar-value-animate]:bg-transparent! [&_.p-progressbar-value-animate]:border! [&_.p-progressbar-value-animate]:border-white! bg-[#14161c]!`}
        />
        <p className="w-max min-w-max px-4 text-white">
          {currentExportStep}/{maxExportStep} laporan diproses
        </p>
      </div>
    </PrimeReactProvider>
  );
}
