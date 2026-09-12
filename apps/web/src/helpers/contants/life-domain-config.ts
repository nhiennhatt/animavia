import { LifeDomainEnum } from "./app";

export const lifeDomainConfig: Record<
  (typeof LifeDomainEnum)[keyof typeof LifeDomainEnum],
  { name: string; english: string; background: string; foreground: string }
> = {
  DOMAIN_364: {
    name: "Thể chất",
    english: "Physical",
    background: "#FDF0EB",
    foreground: "#B85C38",
  },
  DOMAIN_953: {
    name: "Cảm xúc",
    english: "Emotional",
    background: "#FCEEF2",
    foreground: "#B55D75",
  },
  DOMAIN_247: {
    name: "Quan hệ",
    english: "Relational",
    background: "#FFF5EB",
    foreground: "#C07D32",
  },
  DOMAIN_584: {
    name: "Tâm linh",
    english: "Spiritual",
    background: "#F3EEF8",
    foreground: "#74568F",
  },
  DOMAIN_424: {
    name: "Trí tuệ",
    english: "Intellectual",
    background: "#EBF3F8",
    foreground: "#3F6D8C",
  },
  DOMAIN_744: {
    name: "Môi trường",
    english: "Ecological",
    background: "#EEF5EE",
    foreground: "#4B7355",
  },
  DOMAIN_929: {
    name: "Nghề nghiệp",
    english: "Vocational",
    background: "#F1F2F6",
    foreground: "#57606F",
  },
};
