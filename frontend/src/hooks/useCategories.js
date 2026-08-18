import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/catagories.api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
}
