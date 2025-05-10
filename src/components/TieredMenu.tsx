
import { useRef } from 'react';
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
interface menuTieredProps {
    label: string;
}

interface MenuItemExtended extends MenuItem {
    label: string;
    icon?: string;
    items?: MenuItemExtended[];
}

export default function PopupDemo(this: void, props: menuTieredProps) {
    const menu = useRef<TieredMenu>(null);
    const items: MenuItem[] = [
        {
            label: 'Status',
            items: [
                {
                    label: 'Complete',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <TaskAltIcon fontSize="small" /> Complete
                        </div>
                    ),
                },
                {
                    label: 'In Process',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <LoopIcon fontSize="small" /> In Process
                        </div>
                    ),
                },
                {
                    label: 'Not Started',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <BlockIcon fontSize="small" /> Not Started
                        </div>
                    ),
                },
                {
                    label: 'Hold',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <PauseCircleIcon fontSize="small" /> Hold
                        </div>
                    ),
                },
            ],
        },
        {
            label: 'Kategori',
            items: [
                {
                    label: 'Safety',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <ShieldIcon fontSize="small" /> Safety
                        </div>
                    ),
                },
                {
                    label: '5R',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <RecyclingIcon fontSize="small" /> 5R
                        </div>
                    ),
                },
                {
                    label: 'Abnormality',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <WarningAmberIcon fontSize="small" /> Abnormality
                        </div>
                    ),
                },
                {
                    label: 'K3',
                    template: () => (
                        <div className="flex align-items-center gap-2">
                            <GroupsIcon fontSize="small" /> K3
                        </div>
                    ),
                },
            ],
        },
    ];


    return (
        <div className="card flex justify-content-center" >
            <TieredMenu model={items} popup ref={menu} breakpoint='4096px' />
            <button className='bg-[#7fa1c3] hover:bg-[#6482ad] px-5 py-2 rounded-lg text-white duration-200' onClick={(e) => menu.current?.toggle(e)
            }>{props.label}</button>
        </div>
    )
}
