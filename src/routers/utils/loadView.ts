// 用來載入 view的函式
// 使用 Vite 的 glob 導入自動載入所有頁面
const modules = import.meta.glob('/src/pages/**/*.vue');

export const loadView = (view: string): (() => Promise<any>) => {
    // 嘗試多種路徑格式
    const possiblePaths = [
        `/src/pages/${view}.vue`,
        `/src/pages/${view}/index.vue`
    ];

    // 先嘗試精確路徑匹配
    for (const path of possiblePaths) {
        if (modules[path]) {
            return modules[path] as () => Promise<any>;
        }
    }

    // 如果找不到精確路徑，嘗試查找匹配的文件
    const matchingPath = Object.keys(modules).find(key =>
        key.endsWith(`/${view}.vue`) || key.endsWith(`${view}/index.vue`)
    );

    if (matchingPath) {
        console.log('Found partial match:', matchingPath);
        return modules[matchingPath] as () => Promise<any>;
    }

    // 如果找不到，返回一個默認的 fallback
    console.warn(`View not found: ${view}`);
    return () => import('../../pages/System/error/NotFound.vue');
};

