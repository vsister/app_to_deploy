import { createAsyncThunk } from '@reduxjs/toolkit';
import { SearchService } from '@services/Search/SearchService';
import { SuccessResponse } from '@services/Service';
import { RootState } from '@store';

const searchService = new SearchService();

export const searchByName = createAsyncThunk('product/search', async (name: string, { getState }) => {
  const { jwt } = (getState() as RootState).user.authStatus;

  const response = await searchService.searchByName(name, jwt);

  if (response instanceof SuccessResponse) {
    return response.data;
  }
});
