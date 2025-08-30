import LoadingAnimation from "../../../../GlobalComponents/Loading/LoadingAnimation";

interface Props {
  label: string,
  value?: number,
  description: string,
  unit: string,
  loading?: boolean
}

export default function CompactBoxData(props: Props) {
  return <>
    <div className="w-full h-48 rounded-2xl border border-white flex justify-center items-center text-white hover:bg-[#1a1d24]/50 relative cursor-default">
      <h1 className="text-2xl absolute top-3 left-4">{props.label}</h1>
      {(() => {
        if(props.loading) {
          return <LoadingAnimation dark_bg />;
        }
        
        return <>
          <h1 className="text-5xl">{props.value}<span className="text-sm">{props.unit}</span></h1>
          <p className="text-sm w-9/12 text-center font-bold absolute -translate-x-1/2 bottom-2 left-1/2">{props.description}</p>
        </>
      })()}
    </div>
  </>
}