import defaultRouter from "./default-router";
import authRouter from "./auth-router";

const Routers = [{path: '/auth', router: authRouter}, {path: '/', router: defaultRouter}];

export default Routers;