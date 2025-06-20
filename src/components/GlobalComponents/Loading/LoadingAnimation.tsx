import "../../../styles/loading_anim.css";

export default function LoadingAnimation({ dark_bg }: { dark_bg?:boolean }) {
  return <div className={`loader ${dark_bg ? "after:shadow-[0_0_0_3px_inset_#ffffff] before:shadow-[0_0_0_3px_inset_#ffffff]" : "after:shadow-[0_0_0_3px_inset_#1f324d] before:shadow-[0_0_0_3px_inset_#1f324d]"}`}>
    <p className={`${dark_bg ? "text-white" : "text-[#1f324d]"}`}>Loading..</p>
  </div>
}