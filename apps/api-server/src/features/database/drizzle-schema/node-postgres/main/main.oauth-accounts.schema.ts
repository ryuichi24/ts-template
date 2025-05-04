import crypto from "crypto";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { text } from "drizzle-orm/pg-core";
import { mainSchema } from "./main-schema";
import { timestamp } from "drizzle-orm/pg-core";

export const provider = mainSchema.enum("provider", ["google", "github", "discord"]);

export const oauthAccounts = mainSchema.table("oauth_accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  provider: provider("provider").notNull(),
  oauthId: text("oauth_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type OauthAccountDBModel = InferSelectModel<typeof oauthAccounts>;
export type InsertOauthAccountDBModel = InferInsertModel<typeof oauthAccounts>;
