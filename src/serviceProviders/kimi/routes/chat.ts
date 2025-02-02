import _ from "lodash";
import Request from "@/lib/request/Request.ts";
import Response from "@/lib/response/Response.ts";
import chat from "../controllers/chat.ts";
import { NAME_SPACE, AUTHORIZATION } from "../CONSTANTS.ts";

export default {
  prefix: `/${NAME_SPACE}/v1/chat`,

  post: {
    "/completions": async (request: Request) => {
      request
        .validate(
          "body.conversation_id",
          (v) => _.isUndefined(v) || _.isString(v)
        )
        .validate("body.messages", _.isArray)
        .validate("headers.authorization", _.isString);
      // refresh_token切分
      const BearerHeader = AUTHORIZATION
        ? AUTHORIZATION
        : request.headers.authorization;
      const tokens = chat.tokenSplit(BearerHeader);
      // 随机挑选一个refresh_token
      const token = _.sample(tokens);
      let {
        model,
        conversation_id: convId,
        messages,
        stream,
        use_search,
      } = request.body;

      if (use_search) model = "kimi-search";

      if (stream) {
        const stream = await chat.createCompletionStream(
          model,
          messages,
          token,
          convId
        );
        return new Response(stream, {
          type: "text/event-stream",
        });
      } else return await chat.createCompletion(model, messages, token, convId);
    },
  },
};
