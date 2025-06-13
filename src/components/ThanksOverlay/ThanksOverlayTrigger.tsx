import { useThanksModalHook } from "../../hooks/shared/useThanksModal";

export default function ThanksOverlayTrigger() {
    const { showThanks } = useThanksModalHook();

    return <span className={showThanks ? "show-thanks" : ""}></span>
}