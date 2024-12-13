import {appRequest} from "../test-setup";
import {validLoginPayload, validRegisterPayload} from "../testVectors/payloads";

export const getAccessToken = async () => {
  await appRequest.post('/api/auth/register').send(validRegisterPayload);
  const response = await appRequest.post('/api/auth/login').send(validLoginPayload);
  return response.body.data.accessToken;
}

export const getAccessTokenForOtherUser = async () => {
  await appRequest.post('/api/auth/register').send({...validRegisterPayload, email: "testemail2@test.com"});
  const response = await appRequest.post('/api/auth/login').send(validLoginPayload);
  return response.body.data.accessToken;
}