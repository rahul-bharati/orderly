import { Request, Response } from "express";

import Project from "../models/project";
import { STATUS_CODE } from "../constants/status_codes";
import mongoose from "mongoose";
import { ERROR_MESSAGES } from "../constants/error-message";
import { MESSAGES } from "../constants/messages";

class ProjectController {
  async createProject(req: Request, res: Response) {
    const { name, description = '' } = req.body;
    const project = new Project({ name, description, owner: req.userId, collaborators: [{ user: req.userId, role: "admin" }] });
    const savedProject = await project.save();
    res.status(STATUS_CODE.CREATED).send({ data: { project: savedProject } });
  }

  async getProjects(req: Request, res: Response) {
    const projects = await Project.find({ owner: req.userId });
    res.status(STATUS_CODE.OK).send({ data: { projects } });
  }

  async getProject(req: Request, res: Response) {
    const projectId = req.params.id || '';

    if (!(mongoose.Types.ObjectId.isValid(projectId))) {
      res.status(STATUS_CODE.NOT_FOUND).send({ errors: [{ field: 'id', message: ERROR_MESSAGES.PROJECT_NOT_FOUND }] });
      return;
    }

    const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.userId }, { "collaborators.user": req.userId }] });
    if (!project) {
      res.status(STATUS_CODE.NOT_FOUND).send({ errors: [{ field: 'id', message: ERROR_MESSAGES.PROJECT_NOT_FOUND }] });
      return;
    }

    res.status(STATUS_CODE.OK).send({ data: { project } });
  }

  async updateProject(req: Request, res: Response) {
    if (!(mongoose.Types.ObjectId.isValid(req.params.id))) {
      res.status(STATUS_CODE.NOT_FOUND).send({ errors: [{ field: 'id', message: ERROR_MESSAGES.PROJECT_NOT_FOUND }] });
      return;
    }

    const { name, description } = req.body;
    const project = await Project.findOne({ _id: req.params.id, $or: [{ owner: req.userId }, { "collaborators.user": req.userId }] });
    if (!project) {
      res.status(STATUS_CODE.NOT_FOUND).send({ errors: [{ field: 'id', message: ERROR_MESSAGES.PROJECT_NOT_FOUND }] });
      return;
    }

    project.name = name;
    project.description = description;
    const updatedProject = await project.save();
    res.send({ data: { project: updatedProject } });
  }

  async deleteProject(req: Request, res: Response) {
    if (!(mongoose.Types.ObjectId.isValid(req.params.id))) {
      res.status(STATUS_CODE.NOT_FOUND).send({ errors: [{ field: 'id', message: ERROR_MESSAGES.PROJECT_NOT_FOUND }] });
      return;
    }

    const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
    if (!project) {
      res.status(STATUS_CODE.NOT_FOUND).send({ errors: [{ field: 'id', message: ERROR_MESSAGES.PROJECT_NOT_FOUND }] });
      return;
    }
    await project.deleteOne();
    res.send({ message: MESSAGES.PROJECT_DELETED_SUCCESSFULLY });
  }
}

export default new ProjectController();