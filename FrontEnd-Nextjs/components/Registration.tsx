"use client";

import React, { useState } from "react";
import authService from "@/lib/authService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
import { useToast } from "@/components/ui/use-toast";

const Registration: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register(username, email, password);
      console.log("Registration successful");
      toast({
        title: "Registration successful",
      });

      router.push("/auth/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
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
            <CardTitle className="font-medium">User Registration</CardTitle>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="Enter your email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? "Registering ..." : "Register"}
            </Button>
          </CardFooter>
        </form>
        <CardDescription className="flex justify-center items-center py-2">
          <Link href={"/auth/login"}>
            Already have an account {"  "}
            <span className="underline font-bold">Login</span>
          </Link>
        </CardDescription>
      </Card>
    </div>
  );
};

export default Registration;
