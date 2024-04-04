"use client";
import React, { useState, useEffect } from "react";
import authService from "@/lib/authService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TrophyIcon from "@/public/image.png";
import UserIcon from "@/public/icon.svg";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

interface LeaderboardEntry {
  username: string;
  total_score: number;
  avg_score: number;
  completed_activities: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [noActivities, setNoActivities] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await authService.api.get("/leaderboard/");
        if (response.data.length === 0) {
          setNoActivities(true);
          setIsLoading(false);
        } else {
          setLeaderboard(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setError("Failed to fetch leaderboard");
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-slate-100">
        <CardHeader className="flex flex-row justify-center items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <CardTitle className="text-3xl px-8 py-2 text-center font-bold bg-slate-50 rounded-full shadow-md">
            <Skeleton className="h-8 w-32" />
          </CardTitle>
          <Skeleton className="h-10 w-10 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-1/2 mb-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (noActivities) {
    return <div>No activities have been completed yet.</div>;
  }

  return (
    <>
      <Card className="bg-slate-100">
        <CardHeader className="flex flex-row justify-center items-center gap-4">
          <Image src={TrophyIcon} width={50} height={50} alt="" />
          <CardTitle className="text-3xl px-8 py-2 text-center font-bold bg-slate-50 rounded-full shadow-md">
            Leaderboard
          </CardTitle>
          <Image src={TrophyIcon} width={50} height={50} alt="" />
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <table className="table-auto mx-auto">
              <thead>
                <tr className="bg-[#33312D] text-white">
                  <th className="px-4 py-2 border border-white">Username</th>
                  <th className="px-4 py-2 border border-white">Total Score</th>
                  <th className="px-4 py-2 border border-white">
                    Average Score
                  </th>
                  <th className="px-4 py-2 border border-white">
                    Completed Activities
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} className="m-2 shadow-md">
                    <td className="flex justify-center items-center border px-4 py-2 gap-4">
                      <Image
                        src={UserIcon}
                        width={30}
                        height={30}
                        alt="user icon"
                      />
                      <div className="min-w-[100px]">{entry.username}</div>
                    </td>
                    <td className="border px-4 py-2">{entry.total_score}</td>
                    <td className="border px-4 py-2">
                      {entry.avg_score.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {entry.completed_activities}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Leaderboard;
