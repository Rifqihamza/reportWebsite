import { useThanksModalHook } from "../../../hooks/shared/useThanksModal";

export default function ThanksCloseButton() {
  const { setShowThanks } = useThanksModalHook();

  const handleClose = () => {
    setShowThanks(false);
  }
  
  return <button className="px-4 py-4 bg-[#7FA1C3] text-white rounded-xl uppercase tracking-wider font-bold cursor-pointer" onClick={handleClose}>Selesai</button>;
}