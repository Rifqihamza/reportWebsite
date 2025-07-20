import { useEffect } from "react";
import { create } from "zustand";
import { useUserAccountHook } from '../UsersTab/useUserAccount';
import { useReportDataHook } from '../../shared/useReportData';
import UseReportDataHookEffect from '../../shared/useReportData';
import UseUserAccountHookEffect from '../UsersTab/useUserAccount';
import { ReportStatus } from "../../../types/variables";

const maxReporterRankPerPage = 10;

type ReporterRankData = {
  rank: number;
  name: string;
  totalReports: number;
  totalCompletedReports: number;
};

type useReporterRankType = {
  showedReporterRank: ReporterRankData[],

  reporterRank: ReporterRankData[],
  setReporterRank: (newReporterRank: ReporterRankData[]) => void,

  page: number,
  setPage: (newPage: number) => void,
  
  maxPage: number,
}

export const useReporterRankHook = create<useReporterRankType>((set) => { 
  return {
    showedReporterRank: [],

    reporterRank: [],
    setReporterRank: (newReporterRank) => {
      const newMaxPage = newReporterRank.length / maxReporterRankPerPage; // Update the max page as well
      set(() => ({ reporterRank: newReporterRank, maxPage: newMaxPage, showedReporterRank: newReporterRank.slice(0, maxReporterRankPerPage) }));
    },

    page: 1,
    setPage: (newPage) => {
      const { maxPage } = useReporterRankHook.getState();
      if(newPage < 1 || newPage > maxPage) {
        return;
      }

      set((state) => ({ 
        page: newPage, showedReporterRank: state.reporterRank.slice((newPage-1)*maxReporterRankPerPage, newPage*maxReporterRankPerPage) 
      }))
    },

    maxPage: 1
  }
});

export default function useReporterRankHookEffect() {
  const { reportData } = useReportDataHook();
  const { userAccountData } = useUserAccountHook();
  const { setReporterRank } = useReporterRankHook();
  
  useEffect(() => {
    if(!reportData || !userAccountData) return;

    let result: {
      [name: string]: {
        name: string,
        totalReports: number,
        totalCompletedReports: number
      }
    } = {};

    // Looping through the user data ( O(n) based on how much user data )
    userAccountData.forEach((data) => {
      result[data.username] = {
        name: data.username,
        totalReports: 0,
        totalCompletedReports: 0
      }
    });
    
    const max_date = (new Date()).valueOf() - (1000 * 60 * 60 * 24 * 3); // Report is considered valid after 3 days
    // Looping through report data ( O(2*n) based on how much report data )
    reportData.filter((data) => (new Date(data.created_at)).valueOf() < max_date).forEach((data) => {
      result[data.account_name].totalReports += 1;
      
      if(data.status === ReportStatus.Complete) {
        result[data.account_name].totalCompletedReports += 1;
      }
    });

    // Sort result ( O(n log n) based on how much report data ) .Looping through the result ( O(n) based on how much report data )
    setReporterRank(Object.values(result).sort((a, b) => b.totalReports - a.totalReports).map((data, index) => ({ name: data.name, rank: (index+1), totalReports: data.totalReports, totalCompletedReports: data.totalCompletedReports })));
  }, [reportData, userAccountData]);

  return <>
    <UseReportDataHookEffect />
    <UseUserAccountHookEffect />
  </>;
}
