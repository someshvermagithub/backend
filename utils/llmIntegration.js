// backend/utils/llmIntegration.js
const fetch = require('node-fetch');
const { LLM_API_KEY, LLM_API_URL, LLM_TIMEOUT } = require('../config/config');

async function getLLMResponse(prompt) {
  try {
    const response = await Promise.race([
      fetch(LLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_API_KEY}`,
        },
        body: JSON.stringify({ prompt })
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('LLM API timeout')), LLM_TIMEOUT)
      )
    ]);
    const data = await response.json();
    return data.response;
  } catch (error) {
    return 'User is unavailable';
  }
}

module.exports = { getLLMResponse };