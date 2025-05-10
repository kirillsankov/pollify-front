import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  email: string; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const login = createAsyncThunk(
  `${process.env.REACT_APP_BACK_LINK}/auth/login`, 
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_LINK}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);

const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  token: storedToken,
  user: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;