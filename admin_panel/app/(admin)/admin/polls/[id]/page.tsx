import { redirect } from 'next/navigation'

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/admin/polls/${id}/edit`)
}