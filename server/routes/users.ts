import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";

const streamClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export const userRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: { id: string; name: string; image?: string } }>(
    "/signup",
    async (req, res) => {
      const { id, name, image } = req.body;

      if (!id || !name) {
        return res.status(400).send();
      }

      const existingUser = await streamClient.queryUsers({ id });

      if (existingUser.users.length) {
        return res.status(400).send("User ID is taken");
      }

      console.log("Updating user in stream");
      streamClient.upsertUser({ id, name, image });
    }
  );

  app.post<{ Body: { id: string } }>("/login", async (req, res) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send();
    }

    const {
      users: [user],
    } = await streamClient.queryUsers({ id });

    if (!user) {
      return res.status(401).send();
    }

    const token = streamClient.createToken(id);
    return {
      token,
      user: { id: user.id, name: user.name, image: user.image },
    };
  });
};
