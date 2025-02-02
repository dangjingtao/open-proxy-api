import _ from "lodash";
import { NAME_SPACE, APP_NAME } from "../CONSTANTS.ts";

export default {
  prefix: `/${NAME_SPACE}/v1`,

  get: {
    "/models": async () => {
      return {
        data: [
          {
            id: "moonshot-v1",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "moonshot-v1-8k",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "moonshot-v1-32k",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "moonshot-v1-128k",
            object: "model",
            owned_by: APP_NAME,
          },
          {
            id: "moonshot-v1-vision",
            object: "model",
            owned_by: APP_NAME,
          },
        ],
      };
    },
  },
};
