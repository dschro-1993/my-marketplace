export type AuditableEntity = {
  // (Type/Name of) Hash-Key defined by individual Domains
  createdAt: string,
  updatedAt: string,
}

// Todo: Add Filter-Criteria
export type Page<T extends AuditableEntity> = {
  lastKey?: Partial<T>, // => Used as Marker
  items:    T[],
}

export type Pageable<T extends AuditableEntity> = {
  nextKey?: Partial<T>, // => Used as Offset
  limit?:   number,
}
