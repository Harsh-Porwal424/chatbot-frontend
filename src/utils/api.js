import axios from "axios";
import { BACKEND_URL } from "./constants";

// Configure axios defaults
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.headers.common['X-Bungee-Tenant'] = 'meijer';

/**
 * Fetch all scenarios with optional search
 * @param {string} search - Optional search query
 * @returns {Promise} Axios response with scenarios data
 */
export const fetchScenarios = async (search = "") => {
  const url = search
    ? `/api/v1/pricing-rules/scenario?search=${encodeURIComponent(search)}`
    : "/api/v1/pricing-rules/scenario";
  return axios.get(url);
};

/**
 * Fetch panels for a specific scenario
 * @param {string} scenarioId - The scenario ID
 * @returns {Promise} Axios response with panels data
 */
export const fetchPanels = async (scenarioId) => {
  return axios.get(`/api/v1/pricing-rules/panel?scenario_id=${scenarioId}`);
};

/**
 * Send chat message to backend
 * @param {Object} payload - Chat message payload
 * @param {string} payload.user_input - User's message
 * @param {string} payload.session_id - Session ID
 * @param {string} payload.agent - Agent type (from AGENT_MAPPING)
 * @param {Object} payload.context - Context object with selections
 * @returns {Promise} Axios response with chat response
 */
export const sendChatMessage = async (payload) => {
  return axios.post(`${BACKEND_URL}/chat`, payload);
};
