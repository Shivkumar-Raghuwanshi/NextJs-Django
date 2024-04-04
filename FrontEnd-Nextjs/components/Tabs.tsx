import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Leaderboard from "@/components/Leaderboard";
import TrainingActivity from "@/components/TrainingActivity";
import ScoreCard from "@/components/ScoreCard";
export function TabsComponent() {
  return (
    <Tabs defaultValue="leaderboard" className="w-[900px]">
      <TabsList className="grid w-full grid-cols-3 gap-4 h-20 items-center bg-white">
        <TabsTrigger value="leaderboard" className="text-2xl h-20 rounded bg-slate-100 shadow-xl" >Leaderboard</TabsTrigger>
        <TabsTrigger value="trainingactivities" className="text-2xl h-20 rounded bg-slate-100 shadow-xl">
          Training Activities
        </TabsTrigger>
        <TabsTrigger value="scorecard" className="text-2xl h-20 rounded bg-slate-100 shadow-xl" >Score Card </TabsTrigger>
      </TabsList>
      <TabsContent value="leaderboard">
        <Leaderboard />
      </TabsContent>
      <TabsContent value="trainingactivities" className="flex flex-row md:flex-col gap-4">
        <TrainingActivity />
      </TabsContent>
      <TabsContent value="scorecard">
        <ScoreCard />
      </TabsContent>
    </Tabs>
  );
}
