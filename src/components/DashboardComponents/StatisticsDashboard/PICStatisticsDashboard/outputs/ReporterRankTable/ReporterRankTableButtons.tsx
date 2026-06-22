import { useReporterRankHook } from "../../../../../../hooks/pages/Statistics/useReporterRankHook";

export default function ReporterRankTableButtons() {
  const { maxPage, page, setPage } = useReporterRankHook();

  return (
    <>
      <button className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around" onClick={() => setPage(page - 1)} disabled={page <= 1}>
        <i className="pi pi-angle-left"></i>
        Prev
      </button>
      <button
        className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
        onClick={() => setPage(page + 1)}
        disabled={page >= maxPage - 1}
      >
        Next
        <i className="pi pi-angle-right"></i>
      </button>
    </>
  );
}
