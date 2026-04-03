"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPolls, getPoll, votePoll } from "@/lib/api/polls";
import { Poll } from "@/types";

const SESSION_KEY = "poll_session_id";

function generateSessionId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export const pollKeys = {
  all: ["polls"] as const,
  detail: (id: string) => ["polls", id] as const,
};

export function usePolls() {
  return useQuery({
    queryKey: pollKeys.all,
    queryFn: async () => {
      const res = await getPolls();
      // getPolls() returns Poll[] directly
      return res.data as Poll[];
    },
  });
}

export function usePoll(id: string) {
  return useQuery({
    queryKey: pollKeys.detail(id),
    queryFn: async () => {
      const res = await getPoll(id);
      return res.data as Poll;
    },
    enabled: !!id,
  });
}

export function useVotePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pollId,
      optionId,
    }: {
      pollId: string;
      optionId: string;
    }) => {
      const sessionToken = getSessionId();
      const res = await votePoll(pollId, optionId, sessionToken);
      return res.data as Poll;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pollKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: pollKeys.all });
    },
  });
}

export function useHasVoted(pollId: string): boolean {
  if (typeof window === "undefined") return false;

  const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}");
  return !!votedPolls[pollId];
}

export function markAsVoted(pollId: string, optionId: string): void {
  if (typeof window === "undefined") return;

  const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}");
  votedPolls[pollId] = optionId;
  localStorage.setItem("voted_polls", JSON.stringify(votedPolls));
}
