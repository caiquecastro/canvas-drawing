import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body ?? '');
    console.log(body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        body,
      }),
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
