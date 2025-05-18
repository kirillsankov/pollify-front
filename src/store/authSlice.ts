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
      console.log(process.env.REACT_APP_BACK_LINK);
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
export const logout = createAsyncThunk(`${process.env.REACT_APP_BACK_LINK}/auth/logout`, async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACK_LINK}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue({ message: 'Network error' });
  }
});

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
    // logout: (state) => {
    //   state.token = null;
    //   state.user = null;
    //   localStorage.removeItem('token');
    //   logoutAPI();
    // },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    // updateToken: (state, action) => {
    //   state.token = action.payload;
    //   localStorage.setItem('token', action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Logout failed';
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
      });
    },
  });

export const { setToken } = authSlice.actions;

export default authSlice.reducer;