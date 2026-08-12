import {
  CloudIcon,
  FlagIcon,
  FlameIcon,
  HandshakeIcon,
  HeartIcon,
  HourglassIcon,
  LauchIcon,
  RedoIcon,
  SunriseIcon,
  SlashIcon,
  SparklesIcon,
  SwordIcon,
  ThumbDownIcon,
  WarningIcon,
  XCircleIcon,
  ZapIcon,
} from "@/components/icons";
import { ComposedEmotion, PrimaryEmotion } from "@/types/emotion";

export const emotionWheel: {
  primary: PrimaryEmotion[];
  composed: ComposedEmotion[];
} = {
  primary: [
    {
      position: 1,
      name: "Vui vẻ",
      code: "joy",
      Icon: LauchIcon,
      color: "#E9C46A",
      intensities: [
        { position: 1, name: "Thư thái", code: "serenity", belongWith: "joy" },
        { position: 2, name: "Ngấy ngây", code: "ecstasy", belongWith: "joy" },
      ],
    },
    {
      position: 2,
      name: "Tin tưởng",
      code: "trust",
      Icon: HandshakeIcon,
      color: "#A8C3A6",
      intensities: [
        {
          position: 1,
          name: "Chấp nhận",
          code: "acceptance",
          belongWith: "trust",
        },
        {
          position: 2,
          name: "Ngưỡng mộ",
          code: "admiration",
          belongWith: "trust",
        },
      ],
    },
    {
      position: 3,
      name: "Sợ hãi",
      code: "fear",
      Icon: WarningIcon,
      color: "#7E8D85",
      intensities: [
        { position: 1, name: "E sợ", code: "apprehension", belongWith: "fear" },
        { position: 2, name: "Khiếp đảm", code: "terror", belongWith: "fear" },
      ],
    },
    {
      position: 4,
      name: "Bất ngờ",
      code: "surprise",
      Icon: ZapIcon,
      color: "#98C1D9",
      intensities: [
        {
          position: 1,
          name: "Bị lôi cuốn",
          code: "distration",
          belongWith: "surprise",
        },
        {
          position: 2,
          name: "Kinh ngạc",
          code: "amazement",
          belongWith: "surprise",
        },
      ],
    },
    {
      position: 5,
      name: "Buồn bã",
      code: "sadness",
      Icon: CloudIcon,
      color: "#6D8299",
      intensities: [
        {
          position: 1,
          name: "Trầm ngâm",
          code: "pensiveness",
          belongWith: "sadness",
        },
        { position: 2, name: "Đau khổ", code: "grief", belongWith: "sadness" },
      ],
    },
    {
      position: 6,
      name: "Chán ghét",
      code: "disgust",
      Icon: ThumbDownIcon,
      color: "#9A8C98",
      intensities: [
        {
          position: 1,
          name: "Chán nản",
          code: "boredom",
          belongWith: "disgust",
        },
        {
          position: 2,
          name: "Ghê tởm",
          code: "loathing",
          belongWith: "disgust",
        },
      ],
    },
    {
      position: 7,
      name: "Giận dữ",
      code: "anger",
      Icon: FlameIcon,
      color: "#E07A5F",
      intensities: [
        {
          position: 1,
          name: "Bực bội",
          code: "annoyance",
          belongWith: "anger",
        },
        { position: 2, name: "Thịnh nộ", code: "rage", belongWith: "anger" },
      ],
    },
    {
      position: 8,
      name: "Mong đợi",
      code: "anticipation",
      Icon: HourglassIcon,
      color: "#F4A261",
      intensities: [
        {
          position: 1,
          name: "Hứng thú",
          code: "interest",
          belongWith: "anticipation",
        },
        {
          position: 2,
          name: "Cảnh giác",
          code: "vigilance",
          belongWith: "anticipation",
        },
      ],
    },
  ],
  composed: [
    {
      position: 1,
      name: "Yêu mến",
      code: "love",
      Icon: HeartIcon,
      color: "#BCE694",
    },
    {
      position: 2,
      name: "Quy phục",
      code: "submission",
      Icon: FlagIcon,
      color: "#5FCF93",
    },
    {
      position: 3,
      name: "Kính sợ",
      code: "awe",
      Icon: SparklesIcon,
      color: "#5AC1BB",
    },
    {
      position: 4,
      name: "Chối bỏ",
      code: "disapproval",
      Icon: XCircleIcon,
      color: "#5CAAF9",
    },
    {
      position: 5,
      name: "Hối hận",
      code: "remorse",
      Icon: RedoIcon,
      color: "#7186F8",
    },
    {
      position: 6,
      name: "Khinh thuờng",
      code: "contempt",
      Icon: SlashIcon,
      color: "#CF7EB5",
    },
    {
      position: 7,
      name: "Hiếu thắng",
      code: "aggressiveness",
      Icon: SwordIcon,
      color: "#F98156",
    },
    {
      position: 8,
      name: "Lạc quan",
      code: "optimism",
      Icon: SunriseIcon,
      color: "#F6B85C",
    },
  ],
};
