import { PrimeReactProvider } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { Campus } from "../../../types/variables";
import { useFormSidebarHooks } from "../../../hooks/pages/LocationTab/useLocationHooks";

export default function LocationToolbar() {
  const { selectedCampus, setSelectedCampus } = useFormSidebarHooks();

  return (
    <PrimeReactProvider>
      <div className="w-full h-max border border-white p-2 gap-1">
        <div className="max-w-48 flex flex-col">
          <p className="text-md font-bold">Selected Campus :</p>
          <Dropdown
            className="w-full bg-[#2e343f]! *:bg-[#2e343f]! *:text-white!"
            panelClassName="rounded-none! [&_.p-dropdown-item]:hover:text-white! [&_.p-dropdown-item]:hover:bg-[#f97316]! [&_.p-highlight]:bg-[#f97316]! [&_.p-focus]:bg-[#fd8b51]! bg-[#fd8b51]!"
            options={Object.values(Campus)}
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.value as Campus)}
          />
        </div>
      </div>
    </PrimeReactProvider>
  );
}
