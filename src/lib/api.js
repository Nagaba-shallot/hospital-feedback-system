// Thin fetch wrapper around the Hospital Feedback System API.
//
// Set NEXT_PUBLIC_API_URL in .env.local to point at your backend
// (defaults to http://localhost:8000 for local dev).

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

async function request(path, { method = "GET", body, token, sessionToken, isForm = false } = {}) {
  const headers = {};
  if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (sessionToken) headers["X-Session-Token"] = sessionToken;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const detail = data?.detail || res.statusText;
    throw new ApiError(
      typeof detail === "string" ? detail : "Request failed",
      res.status,
      detail
    );
  }
  return data;
}

// --- public: patient survey flow -------------------------------------------

export function scanQrCode(qrCodeToken) {
  return request(`/qr-scan/${encodeURIComponent(qrCodeToken)}`, { method: "POST" });
}

export function listFeedbackCategories() {
  return request("/feedback-categories");
}

export function listQuestions(feedbackCategoryId) {
  const qs = feedbackCategoryId ? `?feedback_category_id=${feedbackCategoryId}` : "";
  return request(`/questions${qs}`);
}

export function submitAnswer(sessionToken, answer) {
  // answer: { question_id, rating_value | text_response | yes_no_value }
  return request("/feedback-responses", { method: "POST", body: answer, sessionToken });
}

export function getMyProgress(sessionToken) {
  return request("/survey-progress/me", { sessionToken });
}

export function getMyAnswers(sessionToken) {
  return request("/feedback-responses/me", { sessionToken });
}

// --- admin auth --------------------------------------------------------------

export function adminLogin(email, password) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  return request("/auth/login", { method: "POST", body: form, isForm: true });
}

export function getMyAdminProfile(token) {
  return request("/admins/me", { token });
}

// --- admin: departments --------------------------------------------------------

export function listDepartmentsPublic() {
  return request("/departments");
}

export function listDepartmentsAll(token) {
  return request("/departments/all", { token });
}

export function createDepartment(token, name) {
  return request("/departments", { method: "POST", body: { name }, token });
}

export function getDepartmentQrToken(token, departmentId) {
  return request(`/departments/${departmentId}/qr-token`, { token });
}

// --- admin: feedback --------------------------------------------------------

export function listFeedbackResponses(token, { patientId, questionId } = {}) {
  const params = new URLSearchParams();
  if (patientId) params.set("patient_id", patientId);
  if (questionId) params.set("question_id", questionId);
  const qs = params.toString() ? `?${params}` : "";
  return request(`/feedback-responses${qs}`, { token });
}

export function listAdminReplies(token, feedbackResponseId) {
  const qs = feedbackResponseId ? `?feedback_response_id=${feedbackResponseId}` : "";
  return request(`/admin-replies${qs}`, { token });
}

export function createAdminReply(token, feedbackResponseId, replyText) {
  return request("/admin-replies", {
    method: "POST",
    token,
    body: { feedback_response_id: feedbackResponseId, reply_text: replyText },
  });
}

export { ApiError, API_URL };
