import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseData(
  table: string,
  query?: any,
  dependencies: any[] = []
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, dependencies);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let queryBuilder = (supabase as any).from(table).select('*');
      
      if (query) {
        queryBuilder = query(queryBuilder);
      }

      const { data: result, error: fetchError } = await queryBuilder;

      if (fetchError) {
        setError(fetchError.message);
        toast({
          title: "Ошибка загрузки данных",
          description: fetchError.message,
          variant: "destructive"
        });
        return;
      }

      setData(result || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const create = async (item: any) => {
    try {
      const { data: result, error } = await (supabase as any)
        .from(table)
        .insert(item)
        .select()
        .single();

      if (error) {
        toast({
          title: "Ошибка создания",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      setData(prev => [...prev, result]);
      toast({
        title: "Успешно создано",
        description: "Данные сохранены",
      });

      return result;
    } catch (err: any) {
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    try {
      const { data: result, error } = await (supabase as any)
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Ошибка обновления",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      setData(prev => prev.map(item => 
        item.id === id ? result : item
      ));

      toast({
        title: "Успешно обновлено",
        description: "Изменения сохранены",
      });

      return result;
    } catch (err: any) {
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Ошибка удаления",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      setData(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Успешно удалено",
        description: "Данные удалены",
      });
    } catch (err: any) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove
  };
}