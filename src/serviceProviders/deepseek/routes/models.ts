import _ from "lodash";
import { NAME_SPACE, APP_NAME } from "../CONSTANTS.ts";

export default {
  prefix: `/${NAME_SPACE}/v1`,

  get: {
    "/models": async () => {
      return {
        data: [
          {
            id: "deepseek-chat",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "deepseek-coder",
            object: "model",
            owned_by: APP_NAME,
          },
        ],
      };
    },
  },
};
