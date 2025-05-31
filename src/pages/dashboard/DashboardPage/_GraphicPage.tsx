import React, { Suspense } from "react";
import LoadingAnimation from "../../../components/Loading/LoadingAnimation";

import type { ReportData } from "../../../types/variables";
interface GraphicPageProps {
    reportData: ReportData[];
}
export default function GraphicPage({ reportData }: GraphicPageProps) {
    const GraphicComponent = React.lazy(() => import("../../../DashboardComponents/GraphicDashboard/GraphicComponent"))
    return (
        <Suspense fallback={<LoadingAnimation />}>
            <GraphicComponent reportData={reportData} />
        </Suspense>
    );
}