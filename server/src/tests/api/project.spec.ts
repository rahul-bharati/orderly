import { describe, expect } from "@jest/globals";
import { STATUS_CODE } from "../../constants/status_codes";
import { appRequest } from "../test-setup";
import { ERROR_MESSAGES } from "../../constants/error-message";
import { getAccessToken, getAccessTokenForOtherUser } from "../test-helpers/get-access-token";
import { MESSAGES } from "../../constants/messages";

let accessToken: string;
let accessToken2: string;

beforeAll(async () => {
  accessToken = await getAccessToken();
  accessToken2 = await getAccessTokenForOtherUser();
});

describe("POST /projects", () => {
  it("should return 401 on unauthenticated user", async () => {
    const response = await appRequest.post("/projects").send({});
    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      })
    ]))
  });

  it("should return 400 on no input", async () => {
    const response = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({});
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'name',
        message: ERROR_MESSAGES.PROJECT_NAME_REQUIRED
      }),
    ]));
  });

  it("should return 201 on valid input", async () => {
    const response = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    expect(response.status).toBe(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('project');
    expect(response.body.data.project).toEqual(expect.objectContaining({
      name: "Project 1"
    }));
  });
});

describe("GET /projects", () => {
  it("should return 401 on unauthenticated user", async () => {
    const response = await appRequest.get("/projects");
    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      })
    ]))
  });

  it("should return 200", async () => {
    const response = await appRequest.get("/projects").set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('projects');
    expect(Array.isArray(response.body.data.projects)).toBe(true);
  });
});

describe("GET /projects/:id", () => {
  it("should return 401 on unauthenticated user", async () => {
    const response = await appRequest.get("/projects/1");
    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      })
    ]))
  });

  it("should return 404 on no permission", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.get(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken2}`);
    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'id',
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      })]));
  });

  it("should return 404 on invalid id", async () => {
    const response = await appRequest.get("/projects/invalid-id").set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([expect.objectContaining({
      field: 'id',
      message: ERROR_MESSAGES.PROJECT_NOT_FOUND
    })]));
  });

  it("should return 200 on valid id", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.get(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('project');
    expect(response.body.data.project).toEqual(expect.objectContaining({
      name: "Project 1"
    }));
  });
});

describe("PUT /projects/:id", () => {
  it("should return 401 on unauthenticated user", async () => {
    const response = await appRequest.put("/projects/1").send({});
    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      })
    ]));
  });

  it("should return 404 on no permission", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.put(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken2}`).send({ name: "Project 2" });
    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'id',
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      })
    ]));
  });

  it("should return 404 on invalid id", async () => {
    const response = await appRequest.put("/projects/invalid-id").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 2" });
    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'id',
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      })
    ]));
  });

  it("should return 400 on invalid inputs", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.put(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken}`).send({ name: "" });
    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'name',
        message: ERROR_MESSAGES.PROJECT_NAME_REQUIRED
      })
    ]));
  });

  it("should return 200 on valid input", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.put(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 2" });
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('project');
    expect(response.body.data.project).toEqual(expect.objectContaining({
      name: "Project 2"
    }));
  });
});

describe("DELETE /projects/:id", () => {
  it("should return 401 on unauthenticated user", async () => {
    const response = await appRequest.delete("/projects/1");
    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'authorization',
        message: ERROR_MESSAGES.INVALID_TOKEN
      })
    ]));
  });

  it("should return 404 on no permission", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.delete(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken2}`);
    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'id',
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      })
    ]));
  });

  it("should return 404 on invalid id", async () => {
    const response = await appRequest.delete("/projects/invalid-id").set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({
        field: 'id',
        message: ERROR_MESSAGES.PROJECT_NOT_FOUND
      })
    ]));
  });

  it("should return 200 on valid id", async () => {
    const project1 = await appRequest.post("/projects").set('Authorization', `Bearer ${accessToken}`).send({ name: "Project 1" });
    const projectId = project1.body.data.project._id;
    const response = await appRequest.delete(`/projects/${projectId}`).set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(MESSAGES.PROJECT_DELETED_SUCCESSFULLY);
  });
});
