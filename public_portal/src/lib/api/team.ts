import { ApiResponse, TeamMember } from "@/types";
import { apiFetch } from "./client";

export async function getTeamMembers(): Promise<ApiResponse<TeamMember[]>> {
  try {
    return await apiFetch<TeamMember[]>("/api/team-members?limit=100", {
      method: "GET",
    });
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Failed to fetch team members",
    };
  }
}