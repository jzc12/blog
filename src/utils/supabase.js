import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mwqfbczqulrtcqjxmvud.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cWZiY3pxdWxydGNxanhtdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTgzODAsImV4cCI6MjA2NDE5NDM4MH0.e5TinPO93eKHmn2amIWynxKJ09UtBk8jL00BLPm_9kg'
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

export default supabase 