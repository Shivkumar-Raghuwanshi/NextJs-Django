"use client";

import React, { useState } from "react";
import authService from "@/lib/authService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"

import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { toast } = useToast() 


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login(username, password);
      console.log("Login successful");
      toast({
        title: "Login successful",
      });

      router.push("/dashboard");

      // Optionally, you can redirect the user to the dashboard or home page after successful login
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        variant:"destructive",
        title: "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[350px]">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-medium">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 gap-4">
                <Label htmlFor="username">Username</Label>
                <Input
                  placeholder="Enter your username"
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5 gap-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  placeholder="Enter your password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end ">
            <Button variant="default" type="submit">
              {isLoading ? "Submitting ..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
        <CardDescription className="flex justify-center items-center py-2">
        <Link href={"/auth/register"}>
              Are you first time user {"  "}
              <span className="underline font-bold">Register</span>
            </Link>
        </CardDescription>
      </Card>
    </div>
  );
};

export default Login;
