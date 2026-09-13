import Link from "next/link";
import { getAppContext } from "@/lib/org";
import { loadFollowUps } from "@/lib/follow-ups";
import { formatDate } from "@/lib/credentials";
import { parseCellKey, weekEndISO } from "@/lib/enrollments";
import { Card, CardHeader, EmptyState, PageHeader, buttonClass } from "@/components/app/ui";
import FollowUpList from "@/components/app/FollowUpList";
import EnrollmentPanel from "../enrollments/EnrollmentPanel";

// The Monday-morning screen (alcance §3.6): every application whose follow-up
// date fell or falls this week, most overdue first, then the stalled ones.
export default async function FollowUpsPage({ searchParams }) {
  const sp = await searchParams;
  const open = parseCellKey(sp.open);
  const { supabase } = await getAppContext();
  const { queue, stalled, lastContact, directory } = await loadFollowUps(supabase);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Follow-ups"
        description={`Applications to chase this week — through Sunday, ${formatDate(weekEndISO())}. Open one to log the call and set the next date.`}
      />

      <Card className="overflow-hidden">
        <CardHeader title={`This week · ${queue.length}`} />
        {queue.length === 0 ? (
          <EmptyState
            title="Nothing to chase this week"
            description="When you submit an application or log a call, its next follow-up date lands here the week it's due."
            action={<Link href="/enrollments" className={buttonClass("secondary")}>Open the matrix</Link>}
          />
        ) : (
          <FollowUpList items={queue} lastContact={lastContact} directory={directory} basePath="/follow-ups" />
        )}
      </Card>

      <Card className="overflow-hidden">
        <CardHeader
          title={`Stalled · ${stalled.length}`}
          description="With the payer and no status change in more than 30 days."
        />
        {stalled.length === 0 ? (
          <p className="px-5 py-5 text-sm text-ink-500">No stalled applications.</p>
        ) : (
          <FollowUpList items={stalled} lastContact={lastContact} directory={directory} basePath="/follow-ups" mode="stalled" />
        )}
      </Card>

      {open && <EnrollmentPanel key={sp.open} providerId={open.providerId} payerId={open.payerId} closeHref="/follow-ups" />}
    </div>
  );
}
