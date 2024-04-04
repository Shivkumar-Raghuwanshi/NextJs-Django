import { TabsComponent } from "@/components/Tabs";
import { Navbar } from "./components/navbar";

export default function Home() {
  return (
    <div className="flex justify-center gap-4">
      <Navbar />
      <div className="mt-20">
        <TabsComponent />
      </div>
    </div>
  );
}
