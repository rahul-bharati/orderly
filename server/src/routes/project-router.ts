import {Router} from 'express';
import ProjectController from "../controllers/project-controller";
import {authMiddleware} from "../middlewares/auth-middleware";
import {validateBody} from "../middlewares/schema-validation";
import {ProjectSchemaZod} from "../zod-schemas/project-schema";

class ProjectRouter {
  router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  init() {
    this.router.get('/projects', [authMiddleware], ProjectController.getProjects);
    this.router.get('/projects/:id', [authMiddleware], ProjectController.getProject);
    this.router.post('/projects', [authMiddleware, validateBody(ProjectSchemaZod)], ProjectController.createProject);
    this.router.put('/projects/:id', [authMiddleware, validateBody(ProjectSchemaZod)], ProjectController.updateProject);
    this.router.delete('/projects/:id', [authMiddleware], ProjectController.deleteProject);
  }
}

const projectRouter = new ProjectRouter().router;
export default projectRouter;