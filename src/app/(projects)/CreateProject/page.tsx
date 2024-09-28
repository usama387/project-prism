import { Button } from "@/components/ui/button";
import CreateProjectDialog from "../_components/CreateProjectDialog";

const CreateProject = () => {
  return (
    <div className="container flex flex-col max-w-2xl items-center justify-between mt-4">
      <div>
        <h1 className="text-center text-3xl font-semibold text-emerald-400">
          Welcome! Let's Get Started on Your New Project
        </h1>
      </div>
      <div className="h-full bg-background">
        <div className="border-b bg-card">
          <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
