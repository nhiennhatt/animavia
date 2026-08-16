export const UserStatusEnum = {
  ACTIVE: "STATUS_024",
  INACTIVE: "STATUS_820",
  BLOCKED: "STATUS_295",
} as const;

export const UserRoleEnum = {
  PRACTITIONER: "ROLE_263",
  CONTENT_CURATOR: "ROLE_985",
  SYS_ADMIN: "ROLE_353",
  SYSTEM: "ROLE_394",
} as const;

export const HabitTypeEnum = {
  CONSTRUCTIVE: "HTYPE_235",
  DESTRUCTIVE: "HTYPE_834",
} as const;

export const LifeDomainEnum = {
  PHYSICAL: 'DOMAIN_364',
  RELATIONAL: 'DOMAIN_247',
  SPIRITUAL: 'DOMAIN_584',
  EMOTIONAL: 'DOMAIN_953',
  INTELLECTUAL: 'DOMAIN_424',
  ECOLOGICAL: 'DOMAIN_744',
  VOCATIONAL: 'DOMAIN_929',
} as const;
