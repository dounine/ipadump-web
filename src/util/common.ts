const pow1024 = (size) => {
    return Math.pow(1024, size)
}

export default {
    sizeFormat: (size) => {
        if (!size) return `${size} B`
        if (size < pow1024(1)) return size + ' B'
        if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB'
        if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB'
        if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB'
        return (size / pow1024(4)).toFixed(2) + 'TB'
    }
}