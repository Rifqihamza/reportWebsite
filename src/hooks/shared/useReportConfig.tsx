import { useEffect } from "react";
import { create } from "zustand";
import { APIResultType, getFormConfiguration, type FormConfigurationResponse } from "../../utils/api_interface";
import { useCampusDataHook } from "../pages/ReportForm/useCampusData";
import { useMessageToastHook } from "./useMessageToast";
import { useNetworkConnectivityHook } from "./useNetworkConnectivity";

type useReportConfigType = {
  picNamesOptions: string[];
  setPicNamesOptions: (newPicNamesOptions: string[]) => void;

  locationOptions: { [key: string]: string[] }
  setLocationOptions: (newLocationOptions: { [key: string]: string[] }) => void;
};

export const useReportConfigHook = create<useReportConfigType>((set) => {
  return {
    // PIC names options
    picNamesOptions: [],
    setPicNamesOptions(newPicNamesOptions) {
      set(() => ({ picNamesOptions: newPicNamesOptions }));
    },

    // Location options
    locationOptions: {},
    setLocationOptions(newLocationOptions) {
      set(() => ({ locationOptions: newLocationOptions }));
    },
  };
});


let initialized = false;

export default function UseReportConfigHookEffect(props: { useAllCampus?: boolean }) {
  const { selectedCampus } = useCampusDataHook();
  const { setLocationOptions, setPicNamesOptions } = useReportConfigHook();
  const { showMessage } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    if(initialized || !isConnected) {
      return;
    }
    initialized = true;
    
    // If not used all campus is not selected yet
    if (!props.useAllCampus && !selectedCampus) {
      return;
    }

    // Get Form Configuration
    getFormConfiguration().then((result) => {
      if ((result as FormConfigurationResponse).location_data !== undefined) {
        result = result as FormConfigurationResponse;
        let resultPicNamesOptions: { [key: string]: string[] } = {};
        let resultLocationOptions: { [key: string]: string[] } = {};

        result.location_data.forEach((value) => {
          if(value.campus_name in resultLocationOptions) {
            resultLocationOptions[value.campus_name].push(value.location);
          }
          else {
            resultLocationOptions[value.campus_name] = [value.location];
          }
          
          resultPicNamesOptions[value.pic_name] = []
        });

        setPicNamesOptions(Object.keys(resultPicNamesOptions));
        setLocationOptions(resultLocationOptions);
      } else if (result === APIResultType.DatabaseError) {
        showMessage("There's an error in database.", "error", "Please reload the website after a while.");
      } else if (result === false) {
        showMessage("There's a network error.", "error", "Please reload the website once you connected.");
      }
    }).catch(() => {
      showMessage("There's a network error.", "error", "Please reload the website once you connected.");
    });
  }, [selectedCampus]);

  return <></>;
}
