

export default function FilterOptions() {
  return <>
    <div className="opacity-50 bg-[#1f324d] rounded-xl w-full min-h-48 lg:h-full shadow-sm shadow-gray-400 col-span-3 row-span-2 row-start-2 col-start-3 flex flex-col relative">
      <div className="absolute -top-2 -right-2 bg-[#263d5d] rounded-full p-2 w-8 h-8 flex items-center justify-center shadow-md shadow-gray-700">
        <h1 className="text-white font-medium">2</h1>
      </div>
      <h1 className="text-xl text-white py-3 px-6 text-center">Opsi Filter</h1>
      <div className="bg-[#ededed] h-full rounded-xl flex justify-center items-center">
        <h1 className="text-xl text-center">Masih dalam pengerjaan</h1>
      </div>
    </div>
  </>;
}