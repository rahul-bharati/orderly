import DefaultRouter from "./default-router";
import AuthRouter from "./auth-router";

const Routers = [{path: '/', router: DefaultRouter}, {path: '/auth', router: AuthRouter}];

export default Routers;