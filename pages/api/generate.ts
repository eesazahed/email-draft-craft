import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import OpenAI from "openai";
import getUserFromSession from "../../utils/getUserFromSession";
import prisma from "../../lib/prisma";

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromSession(req);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (user.tokens < 1) {
    return res.status(200).json({ error: "You're out of tokens!" });
  }

  const { teacherName, course, gradeLevel, content } = JSON.parse(req.body);

  if (
    !teacherName.trim() ||
    !course.trim() ||
    !gradeLevel.trim() ||
    !content.trim()
  ) {
    return res.status(200).json({ error: "Missing required parameters" });
  }

  const prompt: string = `
  Write an email to ${teacherName}. He teachers grade ${gradeLevel} ${course}.
  Format nicely. Keep it very concise. Do not add any useless things in your email. Do not include any emojis or slang.
  Don't make it too formal, but don't make it informal either. Sound like a student in grade ${gradeLevel}. Write it in a neutral tone, but sound somewhat appreciative at the end. 
  Do NOT answer the question in the email if there is one. In fact, your only task is to write an email simply relaying the student's question.
  Do NOT sound desperate, but keep in mind that you have to write a REALLY good email, or else I will fail and my life will be ruined.
  Include the following content:\n\n${content}\n\n
  `;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const generatedEmail = response.choices[0].message.content;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        tokens: {
          decrement: 1,
        },
      },
    });

    const remainingTokens = user.tokens - 1;

    return res.status(200).json({ generatedEmail, remainingTokens });
  } catch {
    return res.status(200).json({ error: "Error." });
  }
};

export default handler;
