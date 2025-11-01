import { ObjectId, MongoServerError } from 'mongodb';
import { getCollection } from './mongodb';
import { User } from '@/types/user';

const COLLECTION_NAME = 'users';
const EMAIL_INDEX_NAME = 'users_email_lower_unique';
const USERNAME_INDEX_NAME = 'users_username_lower_unique';

let userIndexesEnsured = false;

export interface UserDocument {
  _id: ObjectId;
  username: string;
  usernameLower: string;
  email: string;
  emailLower: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
}

export class DuplicateEmailError extends Error {
  constructor() {
    super('Email is already in use');
    this.name = 'DuplicateEmailError';
  }
}

export class DuplicateUsernameError extends Error {
  constructor() {
    super('Username is already in use');
    this.name = 'DuplicateUsernameError';
  }
}

async function getUsersCollection() {
  const collection = await getCollection<UserDocument>(COLLECTION_NAME);

  if (!userIndexesEnsured) {
    try {
      await collection.createIndexes([
        { key: { emailLower: 1 }, unique: true, name: EMAIL_INDEX_NAME },
        { key: { usernameLower: 1 }, unique: true, name: USERNAME_INDEX_NAME },
      ]);
    } catch (error) {
      console.warn('Failed to ensure user indexes', error);
    } finally {
      userIndexesEnsured = true;
    }
  }

  return collection;
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const collection = await getUsersCollection();
  return collection.findOne({ emailLower: email.trim().toLowerCase() });
}

export async function findUserByUsername(username: string): Promise<UserDocument | null> {
  const collection = await getUsersCollection();
  return collection.findOne({ usernameLower: username.trim().toLowerCase() });
}

export async function findUserByIdentifier(identifier: string): Promise<UserDocument | null> {
  const normalized = identifier.trim().toLowerCase();
  const collection = await getUsersCollection();

  return collection.findOne({ $or: [{ emailLower: normalized }, { usernameLower: normalized }] });
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getUsersCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const collection = await getUsersCollection();
  const now = new Date();
  const document: UserDocument = {
    _id: new ObjectId(),
    username: input.username.trim(),
    usernameLower: input.username.trim().toLowerCase(),
    email: input.email.trim().toLowerCase(),
    emailLower: input.email.trim().toLowerCase(),
    passwordHash: input.passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await collection.insertOne(document);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      if (error.keyPattern?.usernameLower) {
        throw new DuplicateUsernameError();
      }

      if (error.keyPattern?.emailLower) {
        throw new DuplicateEmailError();
      }
    }

    throw error;
  }

  return mapUserDocumentToUser(document);
}

export function mapUserDocumentToUser(document: UserDocument): User {
  return {
    id: document._id.toHexString(),
    username: document.username,
    email: document.email,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const existing = await findUserByEmail(email);
  return Boolean(existing);
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const existing = await findUserByUsername(username);
  return Boolean(existing);
}

type DuplicateKeyMongoError = MongoServerError & {
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
};

function isDuplicateKeyError(error: unknown): error is DuplicateKeyMongoError {
  return error instanceof MongoServerError && error.code === 11000;
}
