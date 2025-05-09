
import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import type { MenuItem } from 'primereact/menuitem';

export default function PopupDemo() {
    const menu = useRef<TieredMenu>(null);
    const items: MenuItem[] = [
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
                { label: 'Safety', icon: 'pi pi-fw pi-calendar' },
                { label: '5R', icon: 'pi pi-fw pi-calendar' },
                { label: 'Abnormality', icon: 'pi pi-fw pi-calendar' },
                { label: 'K3', icon: 'pi pi-fw pi-calendar' },
            ],
        },
    ];

    return (
        <div className="card flex justify-content-center" >
            <TieredMenu model={items} popup ref={menu} breakpoint='4096px' />
            <Button className='bg-[#6482ad] px-5 py-2 rounded-lg text-white hover:bg-[#7fa1c3] duration-200' label="Filter" onClick={(e) => menu.current?.toggle(e)
            } />
        </div>
    )
}
