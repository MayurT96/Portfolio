import PortfolioClient from "@/app/PortfolioClient";
import Maintenance from "@/components/Maintenance";

const UNDER_MAINTENANCE = true;

export default function Page() {
  if (UNDER_MAINTENANCE) {
    return <Maintenance />;
  }
  
  return <PortfolioClient />;
}
