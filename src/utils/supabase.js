import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)


// 获取今日留言数
export const getTodayMessageCount = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())
            .lt('created_at', tomorrow.toISOString());

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('查询留言数失败:', error);
        return 0;
    }
}

// 添加新留言
export const addMessage = async (message) => {
    try {
        const { error } = await supabase
            .from('messages')
            .insert([{
                username: message.username || '匿名',
                content: message.content,
                private_message: message.private_message || false
            }])

        if (error) throw error
        return true
    } catch (error) {
        console.error('发送消息失败:', error)
        return false
    }
}

// 获取所有留言
export const getAllMessages = async () => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('private_message', false)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('加载消息失败:', error)
        return []
    }
}

// 获取所有非私有消息的数量
export const getAllPublicMessageCount = async () => {
    try {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('private_message', false);

        if (error) throw error;
        return count || 0;
    } catch (error) {
        console.error('查询非私有消息数量失败:', error);
        return 0;
    }
}

// 获取文章浏览量
export const getArticleViewCount = async (articleName) => {
    try {
        const { data, error } = await supabase
            .from('article_views')
            .select('view_count')
            .eq('article_name', articleName)
            .single(); // 使用 single() 因为 article_name 是主键，应该只有一条记录

        if (error && error.code !== 'PGRST116') { // PGRST116 表示没有找到记录
            throw error;
        }

        return data ? data.view_count : 0;
    } catch (error) {
        console.error(`获取文章 "${articleName}" 浏览量失败:`, error);
        return 0;
    }
};

// 增加文章浏览量
export const incrementArticleViewCount = async (articleName) => {
    try {
        // 先尝试获取当前浏览量
        const { data: existingData, error: fetchError } = await supabase
            .from('article_views')
            .select('view_count')
            .eq('article_name', articleName)
            .single();

        let newViewCount = 1; // 默认新文章的浏览量从1开始
        if (existingData) {
            newViewCount = existingData.view_count + 1;
        }

        const { error: upsertError } = await supabase
            .from('article_views')
            .upsert(
                { article_name: articleName, view_count: newViewCount },
                { onConflict: 'article_name' } // 如果冲突，则更新现有记录
            );

        if (upsertError) throw upsertError;
        return newViewCount;
    } catch (error) {
        console.error(`增加文章 "${articleName}" 浏览量失败:`, error);
        return null;
    }
};

export default supabase

// 新的表， 记录文章的浏览量， 主键是文章名， 字段是浏览量

