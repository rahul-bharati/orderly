import {Request, Response} from "express";

import Project from "../models/project";

class ProjectController {
  async createProject(req: Request, res: Response) {
    const {name, description} = req.body;
    const project = new Project({name, description, owner: req.user._id});
    await project.save();
    res.status(201).send(project);
  }

  async getProjects(req: Request, res: Response) {
    const projects = await Project.find({owner: req.user._id});
    res.send(projects);
  }

  async getProject(req: Request, res: Response) {
    const project = await Project.findOne({_id: req.params.id, owner: req.user._id});
    if (!project) {
      res.status(404).send({message: "Project not found"});
      return;
    }
    res.send(project);
  }

  async updateProject(req: Request, res: Response) {
    const {name, description} = req.body;
    const project = await Project.findOne({_id: req.params.id, owner: req.user._id});
    if (!project) {
      res.status(404).send({message: "Project not found"});
      return;
    }
    project.name = name;
    project.description = description;
    await project.save();
    res.send(project);
  }

  async deleteProject(req: Request, res: Response) {
    const project = await Project.findOne({_id: req.params.id, owner: req.user._id});
    if (!project) {
      res.status(404).send({message: "Project not found"});
      return;
    }
    await project.deleteOne();
    res.send({message: "Project deleted"});
  }
}

export default new ProjectController();