import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const applyTo = ["api::account.account"];

    strapi.documents.use(async (ctx, next) => {
      if (!applyTo.includes(ctx.uid)) {
        return await next();
      }

      if (ctx.action === "delete") {
      }

      const result = await next();

      return result;
    });
  },
};
