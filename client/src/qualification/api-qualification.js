// Same pattern as api-user.js (Week 9 slides) for the qualification API
const API_BASE = "/api/qualifications";

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
const create = async ({ t }, qualification) => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify(qualification),
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

const read = async ({ qualificationId }, signal) => {
  try {
    const response = await fetch(`${API_BASE}/${qualificationId}`, {
      method: "GET",
      signal,
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

const update = async ({ qualificationId }, { t }, qualification) => {
  try {
    const response = await fetch(`${API_BASE}/${qualificationId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify(qualification),
    });
    return await handleResponse(response);
  } catch (err) {
    return handleError(err);
  }
};

const remove = async ({ qualificationId }, { t }) => {
  try {
    const response = await fetch(`${API_BASE}/${qualificationId}`, {
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
