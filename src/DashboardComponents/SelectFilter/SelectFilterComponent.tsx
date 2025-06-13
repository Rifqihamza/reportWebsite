
import { useRef, type Dispatch, type SetStateAction } from 'react';
import { ReportType, ReportStatus, reporttype_to_string } from "../../types/variables";
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
import { useReportFilterHook } from '../../hooks/useReportHook';

export default function FilterSelect() {
    const { selectedFilter, setSelectedFilter } = useReportFilterHook();
    
    const menu = useRef<TieredMenu>(null);
    const items: MenuItem[] = [
        {
            label: "No Filter",
            command: () => {
                setSelectedFilter(null);
            }
        },
        {
            label: 'Status',
            items: Object.values(ReportStatus).map(status => {
                return {
                    label: status.toString(),
                    template: () => (
                        <div className={"flex align-items-center gap-2" + (selectedFilter == status ? " text-[#1d4ed8]" : "")}>
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
                        setSelectedFilter(selectedFilter == status ? null : status);
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
                        <div className={"flex align-items-center gap-2" + (selectedFilter == type ? " text-[#1d4ed8]" : "")}>
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
                        setSelectedFilter(selectedFilter == type ? null : type);
                    }
                }
            })
        }
    ];


    return (
        <div className="flex justify-content-center w-full" >
            <TieredMenu model={items} popup ref={menu} breakpoint='4096px' />
            <button className='bg-white px-4 py-2 rounded-xl text-black duration-200 w-full' onClick={(e) => menu.current?.toggle(e)
            }>{selectedFilter ? (reporttype_to_string(selectedFilter) ?? selectedFilter.toString()) : "Filter"}</button>
        </div>
    )
}
