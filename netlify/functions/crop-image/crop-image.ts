import { Handler } from "@netlify/functions";
import sharp from "sharp";
import fetch from "node-fetch";

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body ?? "");

    if (!body) {
      throw new Error("Invalid request");
    }

    const { width, height, x, y } = body;

    const imageUrl = `${process.env.URL}/paisagem.jpg`;
    const image = await fetch(imageUrl).then((res) => res.arrayBuffer());

    const result = await sharp(image)
      .png()
      .extract({
        width: width * 5,
        height: height * 5,
        top: Math.round(y * 5),
        left: Math.round(x * 5),
      })
      .toBuffer();

    return {
      statusCode: 200,
      body: result.toString("base64"),
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};
