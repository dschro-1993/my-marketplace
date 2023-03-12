import * as mongodb from "mongodb";
import * as dotenv  from "dotenv";

export type Document = {
  _id:       mongodb.ObjectId,
  createdAt: string,
  updatedAt: string,
}

let client: mongodb.MongoClient;

const connectToDB = async(): Promise<void> => {
  if (!client) {
    client = new mongodb.MongoClient(process.env.DB_CONN_STRING!);
    await client
      .connect()
      .catch((reason) => {
        console.error(reason);
        throw reason;
      });
  }
}

// const validator = {
//   $jsonSchema: {
//     bsonType: "object",
//     required: ["createdAt", "updatedAt", "..."],
//     additionalProperties: false,
//     properties: {
//       _id: {},
//       createdAt: {
//         bsonType: "string",
//       },
//       updatedAt: {
//         bsonType: "string",
//       },
//     },
//   },
// };
export type ValidationOptions = {
  validator: object,
}

const applyValidation = async (
  db:             mongodb.DB,
  collectionName: string,
  opts:           ValidationOptions,
): Promise<void> => {
 await db
  .command({
    collMod:   collectionName,
    validator: opts.validator,
  })
  .catch(async () => { // If non-existent
    await db
      .createCollection(
        collectionName,
        {validator: opts.validator},
      )
      .catch((reason) => {
        console.error(reason);
        throw reason;
      });
  });
}

export const getCollection = async <T extends Document>(
  name:               string,
  validationOptions?: ValidationOptions,
): Promise<mongodb.Collection<T>> => {
  dotenv.config();
  await connectToDB();
  const db = client.db(process.env.DB_NAME!);
  if (validationOptions) {
    applyValidation(db, name, validationOptions);
  }
  return db.collection<T>(name);
}

(async () => {
  const userColl = await getCollection("User");
  console.debug(userColl.find())
})();
