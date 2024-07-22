import '@testing-library/svelte/vitest';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});
