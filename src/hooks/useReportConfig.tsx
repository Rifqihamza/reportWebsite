import { useEffect } from "react";
import { create } from "zustand";
import { APIResultType, getFormConfiguration, type formConfigurationResponse } from "../utils/api_interface";
import { useCampusDataHook } from "./shared/useCampusData";
import { useMessageToastHook } from "./shared/useMessageToast";
import { useNetworkConnectivityHook } from "./shared/useNetworkConnectivity";

type useReportConfigType = {
  picNamesOptions: { [key: string]: string[] };
  setPicNamesOptions: (newPicNamesOptions: { [key: string]: string[] }) => void;

  locationOptions: { [key: string]: string[] }
  setLocationOptions: (newLocationOptions: { [key: string]: string[] }) => void;
};

export const useReportConfigHook = create<useReportConfigType>((set) => {
  return {
    // PIC names options
    picNamesOptions: {},
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

export default function UseReportConfigHookEffect(props: { useAll?: boolean }) {
  const { selectedCampus } = useCampusDataHook();
  const { setLocationOptions, setPicNamesOptions } = useReportConfigHook();
  const { showMessage } = useMessageToastHook();
  const { isConnected } = useNetworkConnectivityHook();

  useEffect(() => {
    if(!isConnected) {
        showMessage("Internet koneksi terputus.", "error", "Mohon coba lagi setelah terkoneksi internet");
    }
    
    // If not used all campus is not selected yet
    if (!props.useAll && !selectedCampus) {
      return;
    }

    // Get Form Configuration
    getFormConfiguration().then((result) => {
      if ((result as formConfigurationResponse).location_data !== undefined) {
        result = result as formConfigurationResponse;
        let resultPicNamesOptions: { [key: string]: string[] } = {};
        let resultLocationOptions: { [key: string]: string[] } = {};

        result.pic_data.forEach((value) => {
          if(value.campus_name in resultPicNamesOptions) {
            resultPicNamesOptions[value.campus_name].push(value.name);
          }
          else {
            resultPicNamesOptions[value.campus_name] = [value.name];
          }
        });

        result.location_data.forEach((value) => {
          if(value.campus_name in resultLocationOptions) {
            resultLocationOptions[value.campus_name].push(value.location);
          }
          else {
            resultLocationOptions[value.campus_name] = [value.location];
          }
        });

        setPicNamesOptions(resultPicNamesOptions);
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
