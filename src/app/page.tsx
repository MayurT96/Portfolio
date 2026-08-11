import { notFound } from "next/navigation";
import PortfolioClient from "@/app/PortfolioClient";
import Maintenance from "@/components/Maintenance";

const SHOW_404_ERROR = false; // Set to false to restore the website
const UNDER_MAINTENANCE = false;

export default function Page() {
  if (SHOW_404_ERROR) {
    notFound();
  }

  if (UNDER_MAINTENANCE) {
    return <Maintenance />;
  }
  
  return <PortfolioClient />;
}
