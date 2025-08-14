import { useEffect } from "react";
import { useExportHook } from "../../../../hooks/pages/Export/useExportHook";
import UseReportDataHookEffect, { useReportDataHook } from "../../../../hooks/shared/useReportData";

export default function OtherOptions() {
  const { otherOption, setOtherOption, maxExportedData, setMaxExportedData } = useExportHook();
  const { reportData } = useReportDataHook();

  return (
    <>
      <UseReportDataHookEffect />
      <div className="bg-[#374151] w-full h-fit rounded-xl px-3">
        <div className="flex flex-col gap-2 md:flex-row md:gap-0 justify-between px-4 py-5">
          <div className="w-full">
            <h1 className="text-xl lg:text-2xl font-semibold text-white ">Other Options</h1>
            <span className="text-md lg:text-lg text-white flex flex-row items-center gap-3">
              Opsi lain untuk pengaturan lebih lanjut
              <i className="pi pi-arrow-right hidden! md:inline!"></i>
            </span>
          </div>
          <div className="flex flex-col items-center gap-6 w-full">
            <InputField label="Jumlah Laporan Maksimum" inputType="number" onChange={(value) => setMaxExportedData(value)} value={maxExportedData} max={reportData ? reportData.length : 0} />
            <InputField label="Gambar berupa link" inputType="toggle" onChange={(value) => setOtherOption("usingLinkInsteadOfImage", value)} value={otherOption.usingLinkInsteadOfImage} />
          </div>
        </div>
      </div>
    </>
  );
}



type InputFieldText = {
  label: string,
  inputType: "text",
  onChange: (newValue: string) => void,
  value: string
}

type InputFieldNumber = {
  label: string,
  inputType: "number",
  onChange: (newValue: number) => void,
  value: number,
  max?: number,
  min?: number
}

type InputFieldCheckbox = {
  label: string,
  inputType: "toggle",
  onChange: (newValue: boolean) => void,
  value: boolean
}

type InputFieldProps = InputFieldText|InputFieldNumber|InputFieldCheckbox;


function InputField(props: InputFieldProps) {
  return <div className="w-full h-11 text-white flex flex-row justify-between items-center">
    <p className="">{props.label}</p>
    {(() => {

      if(props.inputType == "text") {
        return <input type="text" value={props.value} onChange={(e) => props.onChange(e.target.value)}></input>
      }

      else if(props.inputType == "number") {
        return <div className="relative">
          <input className={`p-2 w-24 bg-[#14161b] text-white border ${(props.max && props.value > props.max) ? "border-red-500" : "border-transparent"}`} type="number"  value={props.value} onChange={(e) => props.onChange(Number.parseInt(e.target.value))} min={props.min} max={props.max}></input>
          {props.max ? <p className={`${props.value > props.max ? "absolute" : "hidden"} bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-max text-red-400`}>max: {props.max}</p> : <></>}
        </div>
      }

      else if(props.inputType == "toggle") {
        return <div className={`w-24 h-full relative bg-[#13161b] border duration-500 ${props.value ? "border-white" : "border-[#374151]"} rounded-full`}>
          <input className="absolute top-0 left-0 w-full h-full opacity-0 z-100" type="checkbox" checked={props.value} onChange={(e) => props.onChange(e.target.checked)}></input>
          <div className={`absolute top-[4px] duration-500 left-[4px] ${props.value ? "left-[calc(100%_-_4px)] -translate-x-full" : ""} h-[calc(100%_-_8px)] aspect-square rounded-full bg-white`}></div>
        </div>
      }
      
      else {
        return <></>;
      }
    })()}
  </div>;
}