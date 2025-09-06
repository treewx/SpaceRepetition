// API client for backend communication
class APIClient {
    constructor() {
        this.baseUrl = window.location.origin;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Categories API
    async getCategories() {
        return this.request('/api/categories');
    }

    async createCategory(category) {
        return this.request('/api/categories', {
            method: 'POST',
            body: JSON.stringify(category),
        });
    }

    async updateCategory(id, category) {
        return this.request(`/api/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(category),
        });
    }

    async deleteCategory(id) {
        return this.request(`/api/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // Cards API
    async getCards() {
        return this.request('/api/cards');
    }

    async createCard(card) {
        return this.request('/api/cards', {
            method: 'POST',
            body: JSON.stringify(card),
        });
    }

    async updateCard(id, card) {
        return this.request(`/api/cards/${id}`, {
            method: 'PUT',
            body: JSON.stringify(card),
        });
    }

    async deleteCard(id) {
        return this.request(`/api/cards/${id}`, {
            method: 'DELETE',
        });
    }

    // Syllables API
    async getSyllables() {
        return this.request('/api/syllables');
    }

    async saveSyllable(syllable) {
        return this.request('/api/syllables', {
            method: 'POST',
            body: JSON.stringify(syllable),
        });
    }

    // Character Mnemonics API
    async getCharacters() {
        return this.request('/api/characters');
    }

    async getCharacter(character) {
        return this.request(`/api/characters/${encodeURIComponent(character)}`);
    }

    async saveCharacter(characterData) {
        return this.request('/api/characters', {
            method: 'POST',
            body: JSON.stringify(characterData),
        });
    }
}

// Create global API client instance
window.apiClient = new APIClient();