// db.js
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import {DB_KEY, DB_URL} from '$env/static/private';
import * as schema from './schema';

export const libsqlClient = createClient({
  url: DB_URL,
  authToken: DB_KEY
});

export const db = drizzle(libsqlClient, { schema });
