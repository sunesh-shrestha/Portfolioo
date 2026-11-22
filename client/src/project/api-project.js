// Same pattern as api-user.js (Week 9 slides) for the project API
const API_BASE = "/api/projects";

const handleResponse = async (response) => {
  try {
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to parse response JSON:", err);
    throw err;
  }
};

const handleError = (err) => {
  console.error("API call failed:", err);
  return { error: "Could not reach the server" };
};

// create needs the admin's token
const create = async ({ t }, project) => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify(project),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

const list = async (signal) => {
  try {
    const response = await fetch(API_BASE, {
      method: "GET",
      signal,
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

const read = async ({ projectId }, signal) => {
  try {
    const response = await fetch(`${API_BASE}/${projectId}`, {
      method: "GET",
      signal,
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

const update = async ({ projectId }, { t }, project) => {
  try {
    const response = await fetch(`${API_BASE}/${projectId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify(project),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

const remove = async ({ projectId }, { t }) => {
  try {
    const response = await fetch(`${API_BASE}/${projectId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

export { create, list, read, update, remove };
