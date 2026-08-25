import dayjs from "dayjs";

import "dayjs/locale/vi";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.locale('vi')

export { dayjs };
