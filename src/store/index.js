import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import productsReducer from '../features/products/productsSlice';
import warehousesReducer from '../features/warehouses/warehousesSlice';
import alertsReducer from '../features/alerts/alertsSlice';
import reportsReducer from '../features/reports/reportsSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    warehouses: warehousesReducer,
    settings: settingsReducer,
    inventory: inventoryReducer,
    alerts: alertsReducer,
    reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;