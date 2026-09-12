import { createTimezoneSchemas } from "zod-timezone-validation";

const { CoercedCanonicalTimezoneSchema } = createTimezoneSchemas();

export function getTimeOffset(tz: string) {
  const result = CoercedCanonicalTimezoneSchema.safeParse(tz);

  if (!result.success) return 7;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: result.data,
    timeZoneName: "longOffset",
  });

  const offsetPart = formatter
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName");

  const match = offsetPart?.value.match(/^GMT(?:([+-])(\d{2}):(\d{2}))?$/);
  if (!match) return 0;

  const [, sign, hours] = match;
  if (!sign) return 0;

  const integerHours = parseInt(hours, 10);
  return sign === "-" ? -integerHours : integerHours;
}

export function getCurrentSecondsInDay(
  tz: string,
  time: number = Math.trunc(new Date().getTime() / 1000),
) {
  return (time + getTimeOffset(tz) * 3600) % 86400;
}

export function getTodayUnix(tz: string) {
  const now = Math.trunc(new Date().getTime() / 1000);
  return now - getCurrentSecondsInDay(tz, now);
}
