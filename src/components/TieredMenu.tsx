
import { useRef, type Dispatch, type SetStateAction } from 'react';
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
import GroupsIcon from '@mui/icons-material/Groups';
import { ReportType, ReportStatus, reporttype_to_string } from "../types/variables";
interface menuTieredProps {
    label: string;
    selectedFilter: ReportStatus | ReportType | null,
    setSelectedFilter: Dispatch<SetStateAction<ReportStatus | ReportType | null>>
}

export default function PopupDemo(props: menuTieredProps) {
    const menu = useRef<TieredMenu>(null);
    const items: MenuItem[] = [
        {
            label: "No Filter",
            command: () => {
                props.setSelectedFilter(null);
            }
        },
        {
            label: 'Status',
            items: Object.values(ReportStatus).map(status => {
                return {
                    label: status.toString(),
                    template: () => (
                        <div className="flex align-items-center gap-2">
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
                        props.setSelectedFilter(props.selectedFilter == status ? null : status);
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
                        <div className="flex align-items-center gap-2">
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
                        props.setSelectedFilter(props.selectedFilter == type ? null : type);
                    }
                }
            })
        }
    ];


    return (
        <div className="card flex justify-content-center" >
            <TieredMenu model={items} popup ref={menu} breakpoint='4096px' />
            <button className='bg-[#7fa1c3] hover:bg-[#6482ad] px-5 py-2 rounded-lg text-white duration-200' onClick={(e) => menu.current?.toggle(e)
            }>{props.selectedFilter ? (reporttype_to_string(props.selectedFilter) ?? props.selectedFilter.toString()) : props.label}</button>
        </div>
    )
}
