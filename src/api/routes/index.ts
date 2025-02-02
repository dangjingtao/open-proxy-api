import fs from "fs-extra";

import Response from "@/lib/response/Response.ts";

export default [
  {
    get: {
      "/": async () => {
        const content = await fs.readFile("public/index.html");
        return new Response(content, {
          type: "html",
          headers: {
            Expires: "-1",
          },
        });
      },
    },
  },
];
