import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";
import TieredDropDown from "../../components/TieredMenu/TieredMenuComponent";
import React, { Suspense, useState, type Dispatch, type SetStateAction } from "react";
import LoadingAnimation from "../Loading/LoadingAnimation";
import type { ReportData, ReportStatus, ReportType, User } from "../../types/variables";

const ReportListComponent = React.lazy(() => import("../../components/TableReport/ReportTableComponent"));


export default function ReportTableWrapper({ userData, reportData, setReportData }: { userData: User | null, reportData: ReportData[], setReportData: Dispatch<SetStateAction<ReportData[]>> }) {
    const [selectedFilter, setSelectedFilter] = useState(null as null | ReportType | ReportStatus);
    const [dateFilter, setDateFilter] = useState([null, null] as (Date|null)[]);

    return <>
        {/* Header Title */}
        <div className="flex flex-row gap-2 justify-center items-center mb-4 md:justify-normal">
            <i className="pi pi-clipboard text-2xl!" />
            <h1 className="titlePage">Data Laporan</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
            {/* Search Bar */}
            <div className="relative w-full flex items-center gap-4">
            <input
                type="text"
                id="search-input"
                placeholder="Cari laporan..."
                className="w-full pl-9 pr-4 py-3 border placeholder:text-md border-gray-300 rounded-lg outline-none"
            />
            <div className="flex items-center gap-1">
                <FloatLabel>
                    <Calendar inputId="from-date" className="w-fit h-full rounded-lg" value={dateFilter ? dateFilter[0] : null} onChange={(e) => setDateFilter([e.value?.getTime() == dateFilter[0]?.getTime() ? null : e.value ?? null, dateFilter[1] ?? null])} readOnlyInput hideOnRangeSelection />
                    <label htmlFor="from-date">Dari tanggal</label>
                </FloatLabel>
                    -
                <FloatLabel>
                    <Calendar inputId="until-date" className="w-fit h-full rounded-lg" value={dateFilter ? dateFilter[1] : null} onChange={(e) => setDateFilter([dateFilter[0] ?? null, e.value?.getTime() == dateFilter[1]?.getTime() ? null : e.value ?? null])} readOnlyInput hideOnRangeSelection />
                    <label htmlFor="until-date" >Sampai tanggal</label>
                </FloatLabel>
            </div>
                <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4  text-gray-400" />
            </div>

            {/* Filter Dropdown */}
            <div className="w-fit">
                <TieredDropDown label="Filter" selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />
            </div>
        </div>

        <Suspense fallback={<LoadingAnimation />}>
            <ReportListComponent userData={userData} reportData={reportData} setReportData={setReportData} selectedFilter={selectedFilter} dateFilter={dateFilter ?? []} />
        </Suspense>
    </>
}