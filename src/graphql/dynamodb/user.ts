import { USERS_TABLE_NAME } from '../../constructs/dynamo';
import { CrudRepository } from '../lib/dynamodb';
import { DataObjectEntity } from '../lib/entity';
import { User } from '../lib/model';

export interface UserDataObject extends DataObjectEntity {
  n: string; // name
  e: string; // email
}

export const translateUserToDataObject = (user: User): UserDataObject => {
  return {
    id: user.id,
    n: user.name,
    e: user.email,
    createdAt: user.createdDate.toISOString(),
    updatedAt: user.lastModifiedDate.toISOString(),
  };
};

export const translateFromDataObjectToUser = (userDataObject: UserDataObject): User => {
  return {
    id: userDataObject.id,
    name: userDataObject.n,
    email: userDataObject.e,
    createdDate: new Date(userDataObject.createdAt),
    lastModifiedDate: new Date(userDataObject.updatedAt),
  };
};

export const userRepository = () => new CrudRepository<UserDataObject>(USERS_TABLE_NAME);