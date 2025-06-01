import { useEffect } from "react";
import { useThanksModalHook } from "../../hooks/shared/useThanksModal";

export default function ThanksOverlayTrigger() {
    const { showThanks } = useThanksModalHook();

    useEffect(() => {
        console.log("Show Thanks:");
        console.log(showThanks);
    }, [showThanks]);

    return <span className={showThanks ? "show-thanks" : ""}></span>
}