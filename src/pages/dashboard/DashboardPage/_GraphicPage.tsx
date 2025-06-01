import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/Loading/LoadingAnimation";

const GraphicComponent = React.lazy(() => import("../../../DashboardComponents/GraphicDashboard/GraphicComponent"))


export default function GraphicPage() {
    return (
        <Suspense fallback={<LoadingAnimation />}>
            <GraphicComponent />
        </Suspense>
    );
}