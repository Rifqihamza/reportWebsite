
import { useRef } from 'react';
import { TieredMenu } from 'primereact/tieredmenu';
import type { MenuItem } from 'primereact/menuitem';

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
    const items: MenuItemExtended[] = [
        {
            label: 'Status',
            items: [
                { label: 'Complete', icon: 'pi pi-fw pi-check' },
                { label: 'In Process', icon: 'pi pi-fw pi-spinner' },
                { label: 'Not Started', icon: 'pi pi-fw pi-times' },
                { label: 'Hold', icon: 'pi pi-fw pi-pause' },
            ],
        },
        {
            label: 'Kategori',
            items: [
                { label: 'Safety', icon: 'pi pi-lock' },
                { label: '5R', icon: 'pi pi-trash' },
                { label: 'Abnormality', icon: 'pi pi-fw pi-calendar' },
                { label: 'K3', icon: 'pi pi-fw pi-calendar' },
            ],
        },
    ];

    return (
        <div className="card flex justify-content-center" >
            <TieredMenu model={items} popup ref={menu} breakpoint='4096px' />
            <button className='bg-[#6482ad] px-5 py-2 rounded-lg text-white hover:bg-[#7fa1c3] duration-200' onClick={(e) => menu.current?.toggle(e)
            }>{props.label}</button>
        </div>
    )
}
