export const perList = [
	{
		label: "报备",
		value: 'Report'
	},
	{
		label: '项目',
		value: 'Project'
	},
	{
		label: '客源',
		value: 'CustomerSource'
	},
	{
		label: '转报备',
		value: 'Share'
	},
	{
		label: '统计',
		value: 'Statistics'
	}
]

//防抖节流函数
export function debounce(handler, delay) {
    var timer;
    return function () {
        var self = this, arg = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            handler.apply(self, arg)
        }, delay)
    }
}