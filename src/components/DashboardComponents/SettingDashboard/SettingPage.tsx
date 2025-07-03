import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";

export default function SettingPage() {
  const { activeTab } = useDashboardNavbarHook();
  if (activeTab !== 5) {
    return <></>;
  }

  return (
    <section className="flex md:flex-row flex-col gap-4 w-full rounded-2xl">
      {/* Gambar Profile */}
      <div className="bg-white shadow shadow-gray-500 flex flex-col items-center gap-4 rounded-2xl p-4 md:w-1/3 w-full">
        <div className="w-full aspect-square flex items-center justify-center">
          <img src="/img/avatar.jpg" className="w-40 h-40 ring-2 ring-[#93BFCF] rounded-full object-cover" alt="User Avatar" />
        </div>
        <button className="bg-gray-300 px-4 py-2 rounded-2xl text-sm flex flex-row items-center gap-2">
          <i className="pi pi-camera"></i>
          Edit
        </button>
      </div>

      {/* Data Profile */}
      <div className="w-full flex flex-col justify-between bg-white shadow shadow-gray-500 rounded-2xl px-8 py-6">
        <ul className="flex flex-col gap-6">
          {/* Username */}
          <li className="flex flex-col items-center gap-2">
            <div className="flex flex-row items-center gap-3 w-full px-4">
              <label htmlFor="username" className="text-xl font-medium w-full">
                Username :
              </label>
              <button className="text-blue-500 font-medium">Edit</button>
            </div>
            <input type="text" id="username" className="outline-none border border-gray-400 rounded-2xl px-3 py-2 w-full" />
          </li>

          {/* Password */}
          <li className="flex flex-col items-center justify-between">
            <div className="flex flex-row items-center gap-3 w-full px-4">
              <label htmlFor="password" className="text-xl font-medium w-full">
                Password :
              </label>
              <button className="text-blue-500 font-medium">Edit</button>
            </div>
            <input type="password" id="password" className="outline-none border border-gray-400 rounded-2xl px-3 py-2 w-full" />
          </li>
        </ul>
      </div>
    </section>
  );
}
