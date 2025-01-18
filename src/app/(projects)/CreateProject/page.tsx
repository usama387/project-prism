"use client";

import { Button } from "@/components/ui/button";
import CreateProjectDialog from "../_components/CreateProjectDialog";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const CreateProject = async () => {
  // getting user from clerk for role based access
  const { user } = useUser();

  if (!user) {
    redirect("/sign-in");
  }

  // extracting role from user object
  const role = user?.publicMetadata.role;

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4 p-4">
      <div>
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-3 font-bold">{user.firstName}! 👋</span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Lst &apos;s get started by setting up your first Project
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can add tasks and change settings at any time
        </h3>
      </div>
      <Separator />
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          {role !== "admin" && (
            <span>You are not authorized to create a new project</span>
          )}
          {role === "admins" && (
            <CreateProjectDialog
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                >
                  New Project
                </Button>
              }
            />
          )}
        </div>
      </div>
      <Separator />
      <Button className="w-full" asChild>
        <Link href="/MyProjects">
          I&apos;m done! Take me to the Projects Page
        </Link>
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
    </div>
  );
};

export default CreateProject;
