import _ from "lodash";

import Request from "@/lib/request/Request.ts";
import Response from "@/lib/response/Response.ts";
import chat from "../controllers/chat.ts";
import logger from "@/lib/logger.ts";
import { NAME_SPACE } from "../CONSTANTS.ts";
export default {
  prefix: `/${NAME_SPACE}/token`,

  post: {
    "/check": async (request: Request) => {
      request.validate("body.token", _.isString);
      const live = await chat.getTokenLiveStatus(request.body.token);
      return {
        live,
      };
    },
  },
};
