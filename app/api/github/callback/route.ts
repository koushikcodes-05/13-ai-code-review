import { getServerSession } from "@/features/auth/actions";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { saveInstallation } from "@/features/github/server/installations";
import { redirect } from "next/navigation";

function buildSignInCallbackUrl(installationId: string | null): string {
    if (installationId) {
      return `/api/github/callback?installation_id=${installationId}`;
    }
  
    return DASHBOARD_ROUTES.github;
  }

export async function GET(request: Request) {

    const {searchParams} = new URL(request.url);

    const installationId = searchParams.get("installation_id");
    const state = searchParams.get("state"); // Add this to get the userId
    const session = await getServerSession();

    // Validate state exists
    if (!state) {
      throw new Error("State parameter not found");
    }

    if(!session){
        const callbackUrl = buildSignInCallbackUrl(installationId);
        redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`); 
    }

    if(installationId){
        await saveInstallation(session.user.id , Number(installationId))
    }

    redirect(DASHBOARD_ROUTES.github)
}