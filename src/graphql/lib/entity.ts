export type AuditableEntity = {
  // Hash-Key will be defined by individual Domains
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}
