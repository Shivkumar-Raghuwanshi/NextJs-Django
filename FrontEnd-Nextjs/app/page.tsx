import Link from "next/link";
import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/homepage/navbar";
import { Footer } from "@/components/homepage/footer";

const HomePage = () => {
  return (
    <div>
      
      <div className="mb-20">
      <Navbar />
      </div>
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center justify-center flex-col">
          <div className="mb-4 flex items-center border shadow-sm p-4 bg-green-100 text-green-700 rounded-full uppercase">
            <Medal className="h-6 w-6 mr-2" />
            Number one professional training plateform
          </div>
          <h1 className="text-2xl md:text-4xl text-center text-neutral-800 mb-6">
          Unlock Your Potential
          </h1>
          <div className="text-3xl md:text-5xl bg-gradient-to-r from-green-600 to-slate-600 text-white px-4 p-2 rounded-md pb-4 w-fit">
            Carry on with work
          </div>
        </div>
        <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
        Whether you are an industry veteran or a fresh learner, our professional training platform equips you with the knowledge and tools to thrive. 
        Boost your skills, stay ahead, and succeed with us!
        </div>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/auth/register">Get started</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
