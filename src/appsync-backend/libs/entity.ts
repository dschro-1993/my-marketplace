import * as t from "io-ts";

export type  Entity = t.TypeOf<typeof Entity>;

export const Entity = t.strict({
  id:        t.string,
  createdAt: t.string,
  updatedAt: t.string,
});
