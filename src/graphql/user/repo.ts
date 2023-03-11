import { USERS_TABLE_NAME } from '../../constructs/dynamo';
import { User } from '../../generated/graphql';
import { CrudRepository } from '../lib/dynamodb';
import { DataObjectEntity } from '../lib/entity';

export interface UserDataObject extends DataObjectEntity {
  n: string; // name
  e: string; // email
}

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