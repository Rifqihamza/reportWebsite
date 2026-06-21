import UseUserDataHookEffect, { useUserDataHook } from "../../../hooks/shared/useUserData";
import { useSettingFormHooks } from "../../../hooks/pages/Settings/useSettingFormHooks";

export default function SettingForm() {
  const { userData } = useUserDataHook();

  const { setEditKey } = useSettingFormHooks();

  return (
    <>
      <UseUserDataHookEffect adminOnly />
      {/* Username */}
      <li
        className="flex flex-row gap-2 md:gap-6 items-center w-full p-2 md:p-8 cursor-pointer hover:bg-[#F97316] hover:text-white hover:rounded-xl duration-300"
        onClick={() => setEditKey("username")}
      >
        <div className="w-full">
          <p className="text-left text-md font-medium">Name</p>
          <p className="w-full text-xl font-medium">{userData?.username}</p>
        </div>
        <i className="pi pi-angle-right md:text-2xl!"></i>
      </li>

      <hr className="my-4" />

      {/* Password */}
      <li
        className="flex flex-row gap-2 md:gap-6 items-center w-full p-2 md:p-8 cursor-pointer hover:bg-[#F97316] hover:text-white hover:rounded-xl duration-300"
        onClick={() => setEditKey("password")}
      >
        <div className="w-full">
          <p className="text-left text-md font-medium">Password</p>
          <p className="w-full text-xl font-medium opacity-50">You know it. Right?</p>
        </div>
        <i className="pi pi-angle-right md:text-2xl!"></i>
      </li>
    </>
  );
}
