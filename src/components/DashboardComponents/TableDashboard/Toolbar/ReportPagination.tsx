import React from 'react';
import { useReportPaginationHook } from "../../../../hooks/useReportHook";

interface ReportPaginationProps {
}

const ReportPagination: React.FC<ReportPaginationProps> = () => {
    const { currentPage, setCurrentPage, maxPage } = useReportPaginationHook();
    
    return (
        <div className="flex flex-row items-center mt-2">
            <div className="flex flex-row justify-evenly md:justify-center gap-2 w-full">
                <button
                    className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
                    disabled={currentPage <= 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    <i className="pi pi-angle-left"></i>
                    Prev
                </button>
                <button
                    className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
                    disabled={currentPage >= (maxPage - 1)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                    <i className="pi pi-angle-right"></i>
                </button>
            </div>
        </div>
    );
};

export default ReportPagination;