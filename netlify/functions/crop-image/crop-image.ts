import { Handler } from '@netlify/functions'
import sharp from 'sharp';

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body ?? '');
    
    if (!body?.squares || !Array.isArray(body.squares) || !body.squares[0]) {
      throw new Error("Invalid request");
    }

    const { width, height, x, y } = body.squares[0]

    const result = await sharp('./paisagem.jpg')
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
