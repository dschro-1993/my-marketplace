import { User } from '../../generated/graphql';
import { CrudRepository } from '../lib/dynamodb';
import { Entity } from '../lib/entity';

export interface UserDataObject extends Entity {
  n: string; // name
  e: string; // email
}

export const translateFromDataObjectToUser = (userDataObject: UserDataObject): User => {
  return {
    id: userDataObject.id,
    name: userDataObject.n,
    email: userDataObject.e,
    createdDate: new Date(userDataObject.ca),
    lastModifiedDate: new Date(userDataObject.ua),
  };
};

export const userRepository = () => new CrudRepository<UserDataObject>('bar');