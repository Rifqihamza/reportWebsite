import { useState } from "react";
import { useDashboardNavbarHook } from "../../../hooks/shared/useDashboardNavbar";
import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import EditProfileModal, { type EditKey } from "./EditProfileModal";

export default function SettingPage() {
  const { activeTab } = useDashboardNavbarHook();
  const { userData } = useUserDataHook();

  const [editKey, setEditKey] = useState<EditKey | undefined>();

  if (activeTab !== 5) {
    return <></>;
  }

  return (
    <>
      <UseUserDataHookEffect adminOnly />
      <section className="flex md:flex-row flex-col gap-4 w-full rounded-2xl p-6">
        {/* Data Profile */}
        <div className="w-full flex flex-row items-center gap-8 bg-[#2b3440] shadow shadow-gray-500 rounded-2xl px-8 py-6">
          <div className="ring-2 ring-[#9CA3AF]/50 rounded-full p-4 w-fit h-fit">
            <i className="pi pi-user" style={{ padding: 60, fontSize: 80, color: "#9CA3AF" }}></i>
          </div>
          <ul className="flex flex-col w-full text-[#9CA3AF]">
            {/* Username */}
            <li className="flex flex-row gap-2 md:gap-6 items-center w-full p-2 md:p-8 cursor-pointer hover:bg-[#F97316] hover:text-white hover:rounded-xl duration-300" onClick={() => setEditKey("username")}>
              <div className="w-full">
                <p className="text-left text-md font-medium">Name</p>
                <p className="w-full text-xl font-medium">{userData?.username}</p>
              </div>
              <i className="pi pi-angle-right md:text-2xl!"></i>
            </li>

            <hr className="my-4" />

            {/* Password */}
            <li className="flex flex-row gap-2 md:gap-6 items-center w-full p-2 md:p-8 cursor-pointer hover:bg-[#F97316] hover:text-white hover:rounded-xl duration-300" onClick={() => setEditKey("password")}>
              <div className="w-full">
                <p className="text-left text-md font-medium">Password</p>
                <p className="w-full text-xl font-medium opacity-50">You know it. Right?</p>
              </div>
              <i className="pi pi-angle-right md:text-2xl!"></i>
            </li>
          </ul>
        </div>
      </section>
      <EditProfileModal editKey={editKey} onDone={() => setEditKey(undefined)} />
    </>
  );
}
