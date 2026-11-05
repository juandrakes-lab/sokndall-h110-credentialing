import LocalDateTime from "@/components/app/LocalDateTime";
import { ACCESS_AT } from "@/lib/billing";

// An accountAccess() message, with its moment (if it has one) shown in the
// viewer's local time.
export default function AccessMessage({ access }) {
  if (!access.message?.includes(ACCESS_AT)) return access.message;
  const [before, after] = access.message.split(ACCESS_AT);
  return (
    <>
      {before}
      <LocalDateTime iso={access.at} />
      {after}
    </>
  );
}
