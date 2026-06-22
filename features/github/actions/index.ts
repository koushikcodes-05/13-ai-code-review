"use server";

import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { deleteInstallation } from "../server/installations";



export async function disconnectGithubApp() {
    const session = await getServerSession();
  
    if (!session) {
      redirect("/sign-in");
    }
  
    await deleteInstallation(session.user.id);
    redirect(DASHBOARD_ROUTES.github);
  }