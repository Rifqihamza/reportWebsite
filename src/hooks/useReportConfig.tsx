import { useEffect } from "react";
import { create } from "zustand";
import { useCampusDataHook } from "./shared/useCampusData";
import { APIResultType, getFormConfiguration, type formConfigurationResponse } from "../utils/api_interface";
import { campus_to_campuscode } from "../types/variables";

type useReportConfigType = {
  picNamesOptions: string[];
  setPicNamesOptions: (newPicNamesOptions: string[]) => void;

  locationOptions: string[];
  setLocationOptions: (newLocationOptions: string[]) => void;
};

export const useReportConfigHook = create<useReportConfigType>((set) => {
  return {
    // PIC names options
    picNamesOptions: [],
    setPicNamesOptions(newPicNamesOptions) {
      set(() => ({ picNamesOptions: newPicNamesOptions }));
    },

    // Location options
    locationOptions: [],
    setLocationOptions(newLocationOptions) {
      set(() => ({ locationOptions: newLocationOptions }));
    },
  };
});

export default function UseReportConfigHookEffect(props: { useAll?: boolean }) {
  const { selectedCampus } = useCampusDataHook();
  const { setLocationOptions, setPicNamesOptions } = useReportConfigHook();

  useEffect(() => {
    // If not used all campus is not selected yet
    if (!props.useAll && !selectedCampus) {
      return;
    }

    // Get Form Configuration
    getFormConfiguration().then((result) => {
      if ((result as formConfigurationResponse).location_data !== undefined) {
        result = result as formConfigurationResponse;
        setPicNamesOptions((selectedCampus ? (result.pic_data.filter((value) => value.campus_name == campus_to_campuscode(selectedCampus))) : (result.pic_data)).map((value) => value.name));
        setLocationOptions((selectedCampus ? (result.location_data.filter((value) => value.campus_name == campus_to_campuscode(selectedCampus))) : (result.location_data)).map((value) => value.location));
      } else if (result === APIResultType.Unauthorized) {
        window.location.href = "/loginPage";
      }
    });
  }, [selectedCampus]);

  return <></>;
}
