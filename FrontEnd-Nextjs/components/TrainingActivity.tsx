"use client";
import React, { useState, useEffect, useCallback } from "react";
import authService from "@/lib/authService";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface Activity {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  completed: boolean;
  score: number | null;
}

const TrainingActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {

      const response = await authService.api.get(`/activities/`);
      if (response.data.message === "No activities found") {
        setActivities([]);
        setIsLoading(false);
      } else {
        setActivities(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      setError("Failed to fetch activities");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleTrainingComplete = useCallback(
    async (activityId: number) => {
      try {

        const response = await authService.api.post(`/training/${activityId}/`);
        console.log("Response Data:", response.data);

        if (response.status === 201) {
          // Update the completed status and score of the activity in the state
          setActivities((prevActivities) =>
            prevActivities.map((activity) =>
              activity.id === activityId
                ? {
                    ...activity,
                    completed: true,
                    score: response.data.score,
                  }
                : activity
            )
          );
        } else if (response.status === 400) {
          if (response.data.error === "Activity already completed") {
            // Update the completed status of the activity in the state
            setActivities((prevActivities) =>
              prevActivities.map((activity) =>
                activity.id === activityId
                  ? { ...activity, completed: true }
                  : activity
              )
            );
            setError(null);
          } else {
            setError(response.data.error);
          }
        } else if (response.status === 404) {
          setError(response.data.error);
        } else if (response.status === 500) {
          setError(response.data.error || "An error occurred during training");
        } else {
          setError("This activity is not allocated to you yet");
        }
      } catch (error) {
        console.error("Failed to complete training:", error);
        setError("This activity is not allocated to you yet");
      }
    },
    []
  );

  const handleReattemptTraining = useCallback(
    (activityId: number) => {
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.id === activityId
            ? {
                ...activity,
                completed: false,
                score: null,
              }
            : activity
        )
      );
    },
    []
  );

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mb-4" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (activities.length === 0) {
    return <div>No activities found</div>;
  }

  return (
    <>
      {activities.map((activity) => (
        <Card key={activity.id} className="bg-slate-100 mb-4">
          <CardHeader>
            <CardTitle>{activity.name}</CardTitle>
            <CardDescription>{activity.description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-row justify-between items-center">
            <div>
              {activity.completed ? (
                <>
                  <Button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded mr-2"
                    disabled
                  >
                    Training Completed
                  </Button>
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleReattemptTraining(activity.id)}
                  >
                    Try Again
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleTrainingComplete(activity.id)}
                >
                  Complete Training
                </Button>
              )}
            </div>
            <div>
              {activity.score !== null && (
                <p className="mt-4 font-bold">Your score: {activity.score}</p>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default TrainingActivity;