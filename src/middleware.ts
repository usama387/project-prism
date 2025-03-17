import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// protected routes in the app are specified here
const isProtectedRoute = createRouteMatcher([
  "/",
  "/MyProjects",
  "/ProjectChart",
  "/CreateProject",
  "/MyTasks",
  "/MyTasks/versions",
  "/CreateTask",
  "/TasksChart",
  "/Issues",
  "/Announcements",
  "/transactions",
  "/manage",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
