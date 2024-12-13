import defaultRouter from "./default-router";
import authRouter from "./auth-router";
import projectRouter from "./project-router";

const Routers = [
  {path: '/auth', router: authRouter},
  {path: '/', router: projectRouter},
  {path: '/', router: defaultRouter}
];

export default Routers;