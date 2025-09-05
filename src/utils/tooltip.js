export default {
    mounted(el, binding) {
        // 创建 tooltip 元素
        const tooltip = document.createElement('div')
        tooltip.className = 'custom-tooltip'
        tooltip.textContent = binding.value
        document.body.appendChild(tooltip)

        // 鼠标移入时显示
        el.addEventListener('mouseenter', (e) => {
            tooltip.style.display = 'block'
            const rect = el.getBoundingClientRect()
            tooltip.style.left = rect.left + rect.width / 2 + 'px'
            tooltip.style.top = rect.top - 8 + window.scrollY + 'px'
        })

        // 鼠标移出时隐藏
        el.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none'
        })

        // 保存引用，便于解绑
        el._tooltip = tooltip
    },

    updated(el, binding) {
        if (el._tooltip) {
            el._tooltip.textContent = binding.value
        }
    },

    unmounted(el) {
        if (el._tooltip) {
            el._tooltip.remove()
            delete el._tooltip
        }
    }
}
