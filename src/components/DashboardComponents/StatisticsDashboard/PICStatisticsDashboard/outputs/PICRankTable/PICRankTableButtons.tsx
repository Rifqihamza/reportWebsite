import { usePICRankHook } from "../../../../../../hooks/pages/Statistics/usePICRankHook";

export default function PICRankTableButtons() {
  const { page, setPage, maxPage } = usePICRankHook();

  return (
    <>
      <button className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around" disabled={page <= 1} onClick={() => setPage(page - 1)}>
        <i className="pi pi-angle-left"></i>
        Prev
      </button>
      <button
        className="disabled:opacity-50 text-white px-2 py-1 rounded-lg bg-gray-600 duration-300 flex flex-row items-center justify-around"
        disabled={page >= maxPage - 1}
        onClick={() => setPage(page + 1)}
      >
        Next
        <i className="pi pi-angle-right"></i>
      </button>
    </>
  );
}
