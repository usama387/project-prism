import { auth } from "@clerk/nextjs/server";

// getting user detail and role from clerk
const { sessionClaims, userId } = auth();

// to access role in a server component
export const role = (sessionClaims?.metadata as { role?: string })?.role;

export const currentUserId = userId;