import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { CalculateRouteUseCase } from '../application/calculate-route.use-case';
import { CalculateRouteInput } from '../domain/calculate-route';

const calculateRouteUseCase = new CalculateRouteUseCase();

export async function calculateRouteHttp(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = (await request.json()) as CalculateRouteInput;
    context.log('Calculating route estimates', { stops: body.stops?.length ?? 0 });

    return {
      status: 200,
      jsonBody: calculateRouteUseCase.execute(body)
    };
  } catch (error) {
    return {
      status: 400,
      jsonBody: {
        message: 'Invalid route calculation payload',
        detail: (error as Error).message
      }
    };
  }
}

app.http('calculate-route', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'calculate-route',
  handler: calculateRouteHttp
});
