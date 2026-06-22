import { PrimeReactProvider } from "primereact/api";
import UsePICFilterHookEffect, { PICFilterTimeSpan, usePICFilterHook } from "../../../../../hooks/pages/Statistics/usePICFilterHook";
import { Dropdown } from "primereact/dropdown";

export default function DateFilterTimeSpanDropdown() {
  const { currentTimeSpan, setCurrentTimeSpan } = usePICFilterHook();

  return (
    <>
      <UsePICFilterHookEffect />
      <PrimeReactProvider>
        <Dropdown
          className="bg-transparent! *:bg-transparent! *:text-white!"
          panelClassName="rounded-none! [&_.p-dropdown-item]:hover:text-white! [&_.p-dropdown-item]:hover:bg-[#f97316]! [&_.p-highlight]:bg-[#f97316]! [&_.p-focus]:bg-[#fd8b51]! bg-[#fd8b51]!"
          options={Object.values(PICFilterTimeSpan)}
          value={currentTimeSpan}
          onChange={(e) => setCurrentTimeSpan(e.value)}
        />
      </PrimeReactProvider>
    </>
  );
}
