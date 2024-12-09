import {appRequest} from '../test-setup';
import {STATUS_CODE} from "../../constants/status_codes";

describe('GET /', () => {
    it('should return 200 OK with message', async () => {
        const response = await appRequest.get('/');
        expect(response.status).toBe(STATUS_CODE.OK);
        expect(response.body).toEqual({message: 'Hello World!'});
    });
});