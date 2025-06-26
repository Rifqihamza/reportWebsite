
import { useRef, type Dispatch, type SetStateAction } from 'react';
import { ReportType, ReportStatus, reporttype_to_string, Campus } from "../../../types/variables";
import { TieredMenu } from 'primereact/tieredmenu';
import type { MenuItem } from 'primereact/menuitem';

// Icon
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LoopIcon from '@mui/icons-material/Loop';
import BlockIcon from '@mui/icons-material/Block';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import RecyclingIcon from '@mui/icons-material/Recycling';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useReportFilterHook } from '../../../hooks/useReportHook';

export default function FilterSelect() {
    const { selectedFilter, setCampusFilter, setReportStatusFilter, setReportTypeFilter, resetFilter } = useReportFilterHook();
    
    const menu = useRef<TieredMenu>(null);
    const items: MenuItem[] = [
        {
            label: "No Filter",
            command: () => {
                resetFilter();
            }
        },
        {
            label: 'Status',
            items: Object.values(ReportStatus).map(status => {
                return {
                    label: status.toString(),
                    template: () => (
                        <div className={`flex align-items-center gap-2 w-full h-full p-3 ${(selectedFilter[1] == status ? "text-white bg-[#7fa1c3] rounded-xl" : "")}`}>
                            {(() => {
                                switch (status) {
                                    case ReportStatus.Complete:
                                        return <TaskAltIcon fontSize="small" />;
                                    case ReportStatus.InProcess:
                                        return <LoopIcon fontSize="small" />;
                                    case ReportStatus.Hold:
                                        return <PauseCircleIcon fontSize="small" />;
                                    case ReportStatus.NotStarted:
                                        return <BlockIcon fontSize="small" />;
                                    default:
                                        return <></>;
                                }
                            })()} {status.toString()}
                        </div>
                    ),
                    command: () => {
                        setReportStatusFilter(selectedFilter[1] == status ? null : status);
                    }
                }
            })
        },
        {
            label: 'Kategori',
            items: Object.values(ReportType).map(type => {
                return {
                    label: reporttype_to_string(type),
                    template: () => (
                        <div className={`flex align-items-center gap-2 w-full h-full p-3 ${(selectedFilter[0] == type ? "text-white bg-[#7fa1c3] rounded-xl" : "")}`}>
                            {(() => {
                                switch (type) {
                                    case ReportType.Abnormality:
                                        return <WarningAmberIcon fontSize="small" />;
                                    case ReportType.Safety:
                                        return <ShieldIcon fontSize="small" />;
                                    case ReportType.VR:
                                        return <RecyclingIcon fontSize="small" />;
                                    default:
                                        return <></>;
                                }
                            })()} {reporttype_to_string(type)}
                        </div>
                    ),
                    command: () => {
                        setReportTypeFilter(selectedFilter[0] == type ? null : type);
                    }
                }
            })
        },
        {
            label: 'Campus',
            items: Object.values(Campus).map(campus => {
                return {
                    label: campus,
                    template: () => (
                        <div className={`flex align-items-center gap-2 w-full h-full p-3 ${(selectedFilter[2] == campus ? "text-white bg-[#7fa1c3] rounded-xl" : "")}`}>
                            {campus}
                        </div>
                    ),
                    command: () => {
                        setCampusFilter(selectedFilter[2] == campus ? null : campus);
                    }
                }
            })
        }
    ];


    return (
        <div className="flex justify-content-center" >
            <TieredMenu model={items} popup ref={menu} breakpoint='4096px' className="mt-2" />
            <button className={`px-4 py-2 rounded-xl duration-200 w-full cursor-pointer ${selectedFilter.find((val) => val !== null) ? "bg-[#7fa1c3] text-white" : "bg-white text-black"}`} onClick={(e) => menu.current?.toggle(e)}>Filter</button>
        </div>
    )
}
