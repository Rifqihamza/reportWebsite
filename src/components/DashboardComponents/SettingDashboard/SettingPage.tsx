import { useState } from "react";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import EditUserDataModal, { type EditKey } from "./EditUserDataModal";

export default function SettingPage() {
  const { activeTab } = useDashboardNavbarHook();
  const { userData } = useUserDataHook();

  const [editKey, setEditKey] = useState<EditKey|undefined>();
  
  if (activeTab !== 5) {
    return <></>;
  }

  return (
    <>
      <UseUserDataHookEffect adminOnly />
      <section className="flex md:flex-row flex-col gap-4 w-full rounded-2xl">
        {/* Data Profile */}
        <div className="w-full flex flex-col justify-between bg-white shadow shadow-gray-500 rounded-2xl px-8 py-6">
          <ul className="flex flex-col">
            {/* Username */}
            <li className="flex flex-row gap-2 md:gap-6 items-center w-full p-2 md:p-8 cursor-pointer hover:bg-gray-100" onClick={() => setEditKey("username")}>
              <div className="w-full">
                <p className="text-left text-md font-medium">Name</p>
                <p className={`w-full text-xl font-medium ${userData === null && "opacity-50"}`}>{userData !== null ? userData?.username : "Loading.."}</p>
              </div>
              <i className="pi pi-angle-right md:text-2xl!"></i>
            </li>

            <hr />

            {/* Password */}
            <li className="flex flex-row gap-2 md:gap-6 items-center w-full p-2 md:p-8 cursor-pointer hover:bg-gray-100" onClick={() => setEditKey("password")}>
              <div className="w-full">
                <p className="text-left text-md font-medium">Password</p>
                <p className="w-full text-xl font-medium opacity-50">You know it. Right?</p>
              </div>
              <i className="pi pi-angle-right md:text-2xl!"></i>
            </li>
          </ul>
        </div>
      </section>
      <EditUserDataModal editKey={editKey} onDone={() => setEditKey(undefined)} />
    </>
  );
}
