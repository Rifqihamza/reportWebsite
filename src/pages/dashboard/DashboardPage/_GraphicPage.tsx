import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/GlobalComponents/Loading/LoadingAnimation";

const GraphicComponent = React.lazy(() => import("../../../components/DashboardComponents/GraphicDashboard/GraphicComponent"))


export default function GraphicPage() {
    return (
        <Suspense fallback={<LoadingAnimation />}>
            <GraphicComponent />
        </Suspense>
    );
}