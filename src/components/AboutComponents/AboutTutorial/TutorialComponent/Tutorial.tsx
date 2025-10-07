"use client";
import { Timeline } from "primereact/timeline";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function TimelineComponent() {
    const events = [
        {
            status:
                'Klik tombol <i><b>Login</b></i> di kanan atas atau tombol <i><b>Lapor Sekarang</b></i> di bagian Tentang E-Lapor',
        },
        { status: 'Setelah klik tombol akan diarahkan ke halaman login.' },
        {
            status:
                'Masukkan username dan password.',
        },
        { status: 'Kemudian pilih kampus yang terdapat temuan.' },
        {
            status:
                'Masukkan Laporan yang ditemukan, lalu klik <b>Submit</b>',
        },
    ];

    return (
        <Timeline
            value={events}
            layout="vertical"
            align="alternate"
            content={(item) => (
                <p
                    className="text-lg"
                    dangerouslySetInnerHTML={{ __html: item.status }}
                />
            )}
            opposite={() => <span></span>}
        />
    );
}
