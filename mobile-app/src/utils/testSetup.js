// Test setup for React Native app
import { store } from '../store';
import { apiService } from '../services/api';

// Test Redux store
export const testStore = () => {
  console.log('Testing Redux store...');
  const state = store.getState();
  console.log('Initial state:', state);
  return state.auth !== undefined;
};

// Test API service
export const testApiService = () => {
  console.log('Testing API service...');
  console.log('API Base URL:', apiService.defaults.baseURL);
  return apiService.defaults.baseURL !== undefined;
};

// Run all tests
export const runTests = () => {
  console.log('Running mobile app tests...');
  
  const storeTest = testStore();
  const apiTest = testApiService();
  
  console.log('Store test:', storeTest ? 'PASS' : 'FAIL');
  console.log('API test:', apiTest ? 'PASS' : 'FAIL');
  
  return storeTest && apiTest;
};