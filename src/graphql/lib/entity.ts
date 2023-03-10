export type AuditableEntity = {
  // Hash-Key will be defined by individual Domains
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface DataObjectEntity extends AuditableEntity {
  id: string;
}
