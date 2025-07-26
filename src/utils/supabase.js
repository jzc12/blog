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
                email: message.email,
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

// 检查文章是否在冷却期内
const isArticleInCooldown = (articleName) => {
    const viewHistory = JSON.parse(localStorage.getItem('articleViewHistory') || '{}');
    const lastViewTime = viewHistory[articleName];

    if (!lastViewTime) return false;

    // 检查是否在48小时冷却期内
    const cooldownHours = 48;
    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    return (Date.now() - lastViewTime) < cooldownMs;
};

// 记录文章访问时间
const recordArticleView = (articleName) => {
    const viewHistory = JSON.parse(localStorage.getItem('articleViewHistory') || '{}');
    viewHistory[articleName] = Date.now();
    localStorage.setItem('articleViewHistory', JSON.stringify(viewHistory));
};

// 增加文章浏览量
export const incrementArticleViewCount = async (articleName) => {
    try {
        // 检查是否在冷却期内
        if (isArticleInCooldown(articleName)) {
            // 在冷却期内，只返回当前浏览量，不增加计数
            const { data: currentData } = await supabase
                .from('article_views')
                .select('view_count')
                .eq('article_name', articleName)
                .single();
            return currentData?.view_count || 0;
        }

        // 不在冷却期内，增加浏览量并记录访问时间
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
                { onConflict: 'article_name' }
            );

        if (upsertError) throw upsertError;

        // 记录这次的访问时间
        recordArticleView(articleName);

        return newViewCount;
    } catch (error) {
        console.error(`增加文章 "${articleName}" 浏览量失败:`, error);
        return null;
    }
};

// ========================== 网站访问统计相关 ==============================

// 获取网站总访问量
export const getTotalVisits = async () => {
    try {
        const { data, error } = await supabase
            .from('site_stats')
            .select('total_visits')
            .eq('id', 1)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data ? data.total_visits : 0;
    } catch (error) {
        console.error('获取总访问量失败:', error);
        return 0;
    }
};



// 获取独立访客数
export const getUniqueVisitors = async () => {
    try {
        const { data, error } = await supabase
            .from('site_stats')
            .select('unique_visitors')
            .eq('id', 1)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data ? data.unique_visitors : 0;
    } catch (error) {
        console.error('获取独立访客数失败:', error);
        return 0;
    }
};

// 检查访客是否在冷却期内
const isVisitorInCooldown = () => {
    const lastVisitTime = localStorage.getItem('last_visit_time');
    if (!lastVisitTime) return false;

    // 30分钟冷却期
    const cooldownMs = 30 * 60 * 1000;
    return (Date.now() - parseInt(lastVisitTime)) < cooldownMs;
};

// 检查是否是新的独立访客
const isNewUniqueVisitor = () => {
    const visitorId = localStorage.getItem('visitor_id');
    return !visitorId;
};

// 生成访客ID
const generateVisitorId = () => {
    const visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('visitor_id', visitorId);
    return visitorId;
};

// 增加网站访问量
export const incrementSiteVisits = async () => {
    try {
        // 检查会话是否已计数
        const sessionCounted = sessionStorage.getItem('session_visit_counted');
        if (sessionCounted === 'true') {
            // 已计数，只返回当前数据
            const [totalVisits, uniqueVisitors] = await Promise.all([
                getTotalVisits(),
                getUniqueVisitors()
            ]);
            return { totalVisits, uniqueVisitors, counted: false };
        }

        // 检查是否在冷却期内
        if (isVisitorInCooldown()) {
            const [totalVisits, uniqueVisitors] = await Promise.all([
                getTotalVisits(),
                getUniqueVisitors()
            ]);
            return { totalVisits, uniqueVisitors, counted: false };
        }

        const isNewVisitor = isNewUniqueVisitor();

        if (isNewVisitor) {
            generateVisitorId();
        }

        // 增加总访问量
        await supabase.rpc('increment_total_visits');

        // 如果是新访客，增加独立访客数
        if (isNewVisitor) {
            await supabase.rpc('increment_unique_visitors');
        }

        // 记录访问时间
        localStorage.setItem('last_visit_time', Date.now().toString());
        sessionStorage.setItem('session_visit_counted', 'true');

        // 获取更新后的数据
        const [totalVisits, uniqueVisitors] = await Promise.all([
            getTotalVisits(),
            getUniqueVisitors()
        ]);

        return { totalVisits, uniqueVisitors, counted: true, isNewVisitor };
    } catch (error) {
        console.error('增加网站访问量失败:', error);
        // 返回默认值
        return { totalVisits: 0, uniqueVisitors: 0, counted: false };
    }
};

export default supabase

// ========================== 数据库表结构说明 ==============================
/*
需要创建以下表和函数：

1. site_stats 表 (网站统计)
CREATE TABLE site_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_visits BIGINT DEFAULT 0,
    unique_visitors BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

2. 数据库函数 (用于原子性更新)
-- 增加总访问量
CREATE OR REPLACE FUNCTION increment_total_visits()
RETURNS void AS $$
BEGIN
    INSERT INTO site_stats (id, total_visits) VALUES (1, 1)
    ON CONFLICT (id) DO UPDATE SET
        total_visits = site_stats.total_visits + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 增加独立访客数
CREATE OR REPLACE FUNCTION increment_unique_visitors()
RETURNS void AS $$
BEGIN
    INSERT INTO site_stats (id, unique_visitors) VALUES (1, 1)
    ON CONFLICT (id) DO UPDATE SET
        unique_visitors = site_stats.unique_visitors + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
*/

