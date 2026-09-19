import { CREDENTIAL_TYPES, businessDate, credentialLabel } from "@/lib/credentials";
import { ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS, CHANNEL_LABELS, PAYER_SELECT, PAYER_TYPE_LABELS, resolvePayer, stalledDays } from "@/lib/enrollments";
import { DOCUMENT_CATEGORIES } from "@/lib/documents";
import { providerIssues } from "@/lib/consistency";
import { loadFollowUps } from "@/lib/follow-ups";
import { REVALIDATION, loadExpirations } from "@/lib/expirations";
import { CREDENTIAL_IMPORT_FIELDS, PROVIDER_IMPORT_FIELDS } from "@/lib/imports";

// CSV export of every list in the app (alcance §3.14). Runs through the
// user's own session, so RLS decides what's in it; never blocked by the plan
// (alcance §4.3 — exporting what's loaded always works).

const name = (p) => (p ? `${p.first_name} ${p.last_name}` : "");

export const VIEWS = {
  async providers({ supabase, practice }) {
    const { data } = await supabase.from("cred_providers").select("*").order("last_name");
    return [
      ["First name", "Last name", "NPI", "CAQH ID", "Taxonomy code", "Specialty", "Email", "Phone", "Start date", "Status", "Data check", "Notes"],
      (data ?? []).map((p) => {
        const issues = providerIssues(p, practice, data);
        return [p.first_name, p.last_name, p.npi, p.caqh_id, p.taxonomy_code, p.specialty, p.email, p.phone, p.start_date, p.status,
          issues.length ? issues.map((i) => i.title).join("; ") : "Matches NPI Registry", p.notes];
      }),
    ];
  },

  async credentials({ supabase }) {
    const { data } = await supabase
      .from("cred_credentials")
      .select("*, cred_providers(first_name, last_name, npi)")
      .order("expiration_date", { ascending: true, nullsFirst: false });
    return [
      ["Provider", "Provider NPI", "Type", "State", "Number", "Issuer / carrier / board", "Coverage", "Issued", "Expires", "Status", "Notes"],
      (data ?? []).map((c) => [name(c.cred_providers), c.cred_providers?.npi, credentialLabel(c.type, c), c.state, c.number, c.issuer,
        c.coverage, c.issue_date, c.expiration_date, c.status, c.notes]),
    ];
  },

  async expirations({ supabase, sp }) {
    const filters = {
      provider: sp.get("provider") ?? "",
      payer: sp.get("payer") ?? "",
      type: CREDENTIAL_TYPES[sp.get("type")] || sp.get("type") === REVALIDATION ? sp.get("type") : "",
      status: ENROLLMENT_STATUSES.includes(sp.get("status")) ? sp.get("status") : "",
    };
    const items = await loadExpirations(supabase, filters);
    return [
      ["Provider", "Provider NPI", "What", "Detail", "Due"],
      items.map((i) => [i.who, i.provider?.npi, i.kind, i.detail, i.date]),
    ];
  },

  async enrollments({ supabase }) {
    const [{ data }, { data: directory }] = await Promise.all([
      supabase
        .from("cred_enrollments")
        .select(`*, cred_providers(first_name, last_name, npi), cred_payers_org(${PAYER_SELECT})`),
      supabase.rpc("cred_org_directory"),
    ]);
    const owner = (directory ?? []).find((d) => d.role === "owner");
    const who = (id) => (id ? (directory ?? []).find((d) => d.user_id === id)?.name : owner?.name) ?? "";
    return [
      ["Provider", "Provider NPI", "Payer", "Payer type", "Status", "Submitted", "Effective", "Next follow-up", "Revalidation due",
        "Application / tracking number", "Responsible", "Last status change", "Stalled", "Notes"],
      (data ?? []).map((e) => {
        const payer = resolvePayer(e.cred_payers_org);
        return [name(e.cred_providers), e.cred_providers?.npi, payer.name, PAYER_TYPE_LABELS[payer.payer_type],
          ENROLLMENT_STATUS_LABELS[e.status], e.submitted_date, e.effective_date, e.next_follow_up_date, e.revalidation_due_date,
          e.external_ref, who(e.assigned_user_id), businessDate(e.status_changed_at), stalledDays(e) ? "Yes" : "No", e.notes];
      }),
    ];
  },

  async "follow-ups"({ supabase }) {
    const { queue, stalled, lastContact } = await loadFollowUps(supabase);
    const row = (list) => (e) => {
      const last = lastContact.get(e.id);
      return [list, name(e.provider), e.payer.name, ENROLLMENT_STATUS_LABELS[e.status], e.next_follow_up_date,
        last?.contact_date, last ? CHANNEL_LABELS[last.channel] : "", last?.reference_number, last?.outcome];
    };
    return [
      ["List", "Provider", "Payer", "Status", "Next follow-up", "Last contact", "Channel", "Reference", "Outcome"],
      [...queue.map(row("This week")), ...stalled.map(row("Stalled"))],
    ];
  },

  async communications({ supabase }) {
    const [{ data }, { data: directory }] = await Promise.all([
      supabase
        .from("cred_communications")
        .select(`*, cred_enrollments(cred_providers(first_name, last_name), cred_payers_org(${PAYER_SELECT}))`)
        .order("contact_date", { ascending: false }),
      supabase.rpc("cred_org_directory"),
    ]);
    const who = (id) => (directory ?? []).find((d) => d.user_id === id)?.name ?? "";
    return [
      ["Date", "Provider", "Payer", "Channel", "Contact", "Reference", "What happened", "What they asked for", "Logged by"],
      (data ?? []).map((c) => [c.contact_date, name(c.cred_enrollments?.cred_providers),
        c.cred_enrollments?.cred_payers_org ? resolvePayer(c.cred_enrollments.cred_payers_org).name : "",
        CHANNEL_LABELS[c.channel], c.contact_person, c.reference_number, c.outcome, c.requested, who(c.created_by)]),
    ];
  },

  async documents({ supabase, sp }) {
    let q = supabase
      .from("cred_documents")
      .select(`*, cred_providers(first_name, last_name), cred_enrollments(cred_payers_org(${PAYER_SELECT}))`)
      .order("created_at", { ascending: false });
    if (sp.get("q")) q = q.ilike("file_name", `%${sp.get("q").replace(/[%_]/g, "")}%`);
    if (sp.get("provider")) q = q.eq("provider_id", sp.get("provider"));
    if (DOCUMENT_CATEGORIES[sp.get("category")]) q = q.eq("category", sp.get("category"));
    const { data } = await q;
    return [
      ["File", "Kind", "Provider", "Application (payer)", "Size (bytes)", "Uploaded"],
      (data ?? []).map((d) => [d.file_name, DOCUMENT_CATEGORIES[d.category], name(d.cred_providers),
        d.cred_enrollments?.cred_payers_org ? resolvePayer(d.cred_enrollments.cred_payers_org).name : "",
        d.size_bytes, businessDate(d.created_at)]),
    ];
  },

  // Every status change, oldest first (the per-client export).
  async history({ supabase }) {
    const [{ data }, { data: directory }] = await Promise.all([
      supabase
        .from("cred_enrollment_events")
        .select(`*, cred_enrollments(cred_providers(first_name, last_name), cred_payers_org(${PAYER_SELECT}))`)
        .order("created_at", { ascending: true }),
      supabase.rpc("cred_org_directory"),
    ]);
    const who = (id) => (directory ?? []).find((d) => d.user_id === id)?.name ?? "";
    return [
      ["When", "Provider", "Payer", "From", "To", "Changed by"],
      (data ?? []).map((e) => [e.created_at, name(e.cred_enrollments?.cred_providers),
        e.cred_enrollments?.cred_payers_org ? resolvePayer(e.cred_enrollments.cred_payers_org).name : "",
        ENROLLMENT_STATUS_LABELS[e.from_status] ?? "", ENROLLMENT_STATUS_LABELS[e.to_status] ?? "", who(e.changed_by)]),
    ];
  },

  // Blank files with the column names the importers recognise.
  async "template-providers"() {
    return [PROVIDER_IMPORT_FIELDS.map((f) => f.label), []];
  },
  async "template-credentials"() {
    return [CREDENTIAL_IMPORT_FIELDS.map((f) => f.label), []];
  },

  async payers({ supabase }) {
    const { data } = await supabase.from("cred_payers_org").select(PAYER_SELECT);
    return [
      ["Payer", "Type", "Revalidates every (months)", "Source"],
      (data ?? []).map(resolvePayer).sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => [p.name, PAYER_TYPE_LABELS[p.payer_type], p.revalidation_months, p.fromCatalog ? "Sokndall list" : "Your own"]),
    ];
  },
};

