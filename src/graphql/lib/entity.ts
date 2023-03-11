export interface AuditableEntity {
  // Hash-Key will be defined by individual Domains
  ca: string; // created at
  ua: string; // updated at
  [key: string]: any;
}

export interface Entity extends AuditableEntity {
  id: string;
}
