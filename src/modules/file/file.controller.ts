import type { FastifyReply, FastifyRequest } from "fastify";

import * as fileService from "@/modules/file/file.service.js";

class FileController {
  async uploadFile(req: FastifyRequest, reply: FastifyReply) {
    const file = await req.file();
    const response = await fileService.uploadFile(file);
    reply.code(200).send(response);
  }
}

export default new FileController();
