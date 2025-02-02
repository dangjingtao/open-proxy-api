import { NAME_SPACE, AUTHORIZATION } from "../CONSTANTS.ts";

export default {
  prefix: `/${NAME_SPACE}/ping`,
  get: {
    "": async () => "pong",
  },
};
