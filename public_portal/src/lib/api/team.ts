import { ApiResponse, TeamMember } from "@/types";

export async function getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";
  console.log("Admin URL:", adminUrl);
  const endpoint = `${adminUrl}/api/admin/team-members?limit=100`;
  
  try {
    console.log("Fetching from:", endpoint);
    const response = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      return { success: false, data: [], message: "Failed to fetch team members" };
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { success: false, data: [], message: String(error) };
  }
}