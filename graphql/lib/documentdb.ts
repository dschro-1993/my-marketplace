import * as mongodb from "mongodb";
import * as dotenv  from "dotenv";

export type Document = {
  id:        mongodb.ObjectId,
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

export const getCollection = async <T extends Document>(name: string): Promise<mongodb.Collection<T>> => {
  dotenv.config();
  await connectToDB();
  const  db = client.db(process.env.DB_NAME!); // => use "DB_NAME"
  return db.collection<T>(name);
}

// (async () => {
//   const userColl = await getCollection("User");
//   console.debug(userColl.find())
// })();
