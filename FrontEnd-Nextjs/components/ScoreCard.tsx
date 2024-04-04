"use client";
import React, { useState, useEffect } from "react";
import authService from "@/lib/authService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";


interface UserScore {
  username: string;
  activityName: string;
  completed: boolean;
  total_score: number;
  avg_score: number;
  completed_activities: number;
}

const ScoreCard: React.FC = () => {
  const [userScore, setUserScore] = useState<UserScore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noActivities, setNoActivities] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const response = await authService.api.get("/user-score/");
        if (response.data.message === "No activities completed yet") {
          setNoActivities(true);
        } else {
          setUserScore(response.data);
        }
        setIsLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch user score:", error);
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError("Failed to fetch user score");
        }
        setIsLoading(false);
      }
    };
    fetchUserScore();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-slate-100">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            <Skeleton className="h-10 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center bg-white">
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
    return <div>You haven not completed any activities yet.</div>;
  }

  if (!userScore) {
    return <div>No user score data available</div>;
  }

  return (
    <>
      <Card className="bg-slate-100">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Your Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center bg-white">
            <table className="table-auto mx-auto">
              <thead>
                <tr className="bg-[#33312D] text-white">
                  <th className="px-4 py-2 border border-white">
                    Activity Name
                  </th>
                  <th className="px-4 py-2 border border-white">Status</th>
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
                {userScore.map((u, i) => (
                  <tr key={i} className="m-2 shadow-md">
                    <td className="border px-4 py-2">{u.activityName}</td>
                    <td className="border px-4 py-2">
                      {u.completed ? "Completed" : "Not Completed"}
                    </td>
                    <td className="border px-4 py-2">{u.total_score}</td>
                    <td className="border px-4 py-2">
                      {u.avg_score.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {u.completed_activities} attempt
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

export default ScoreCard;