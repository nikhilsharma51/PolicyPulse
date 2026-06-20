import MetricsRow from "@/components/dashboard/MetricsRow";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Server, Compass, Network } from "lucide-react";


export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Stats Row */}
      <MetricsRow />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Recent Activity (Col-span 8) */}
        <div className="lg:col-span-12 flex flex-col justify-between">
          <RecentActivity />
        </div>
       
      </div>

      {/* Sub Grid for Secondary details */}
      

    </div>
  );
}
