import { Handler } from '@netlify/functions'
import sharp from 'sharp';
import fetch from 'node-fetch';

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body ?? '');
    
    if (!body?.squares || !Array.isArray(body.squares) || !body.squares[0]) {
      throw new Error("Invalid request");
    }

    const { width, height, x, y } = body.squares[0]

    const imageUrl = 'https://relaxed-alfajores-97f344.netlify.app/paisagem.jpg';
    const image = await fetch(imageUrl).then(res => res.arrayBuffer());

    const result = await sharp(image)
      .png()
      .extract({ width: width * 5, height: height * 5, top: Math.round(y * 5), left: Math.round(x * 5) })
      .toBuffer();

    return {
      statusCode: 200,
      body: result.toString('base64'),
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    }
  }
}
