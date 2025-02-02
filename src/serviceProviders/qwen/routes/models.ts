import _ from "lodash";
import { NAME_SPACE, APP_NAME } from "../CONSTANTS.ts";

export default {
  prefix: `/${NAME_SPACE}/v1`,

  get: {
    "/models": async () => {
      return {
        data: [
          {
            id: "qwen-max",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-max-longcontext",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-plus",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-turbo",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-vl-max",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-vl-plus",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-v1",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "qwen-v1-vision",
            object: "model",
            owned_by: APP_NAME,
          },
        ],
      };
    },
  },
};
