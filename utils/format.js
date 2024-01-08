export const formatDate = (dateStr, translate, config = {}) => {
	const { type, hasTime = false, hasSeconds = false, hasDays = true } = config;
	const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

	const addZero = num => {
		return 0 <= num && 10 > num ? '0' + num : num + '';
	};

	const dateObj =
		type === 'local' ? new Date(dateStr) : new Date(new Date(dateStr).getTime() + new Date(dateStr).getTimezoneOffset() * 60000);
	const seconds = addZero(dateObj.getSeconds());
	const minutes = addZero(dateObj.getMinutes());
	const hour = addZero(dateObj.getHours());
	const month = 'function' === typeof translate ? translate('month_' + months[dateObj.getMonth()]) : months[dateObj.getMonth()];
	const day = dateObj.getDate();
	const year = dateObj.getFullYear();

	let formattedDate = `${month}`;
	formattedDate += hasDays ? ` ${day}` : '';
	formattedDate += `, ${year}`;
	formattedDate += hasTime ? ` • ${hour}:${minutes}` : '';
	formattedDate += hasTime && hasSeconds ? `:${seconds}` : '';

	return formattedDate;
};

export const numberToShortString = num => {
	if (typeof num !== 'number' && typeof num !== 'string') {
		return '';
	}

	const value = num.toString().replace(/[^0-9.]/g, '');

	if (1000 > value) return '' + value;

	let si = [
		{ v: 1e3, s: 'K' },
		{ v: 1e6, s: 'M' },
		{ v: 1e9, s: 'B' }
	];

	let index;
	for (index = si.length - 1; 0 < index; --index) {
		if (value >= si[index].v) break;
	}

	return (value / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[index].s;
};

export const numberToString = num => {
	if (typeof num !== 'number' && typeof num !== 'string') {
		return '';
	}

	return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ');
};

export const truncateDecimals = (num, decimal) => {
	const multiplier = Math.pow(10, decimal);
	const adjustedNum = num * multiplier;
	let truncatedNum;

	if (adjustedNum < 0) {
		truncatedNum = Math.ceil(adjustedNum);
	} else {
		truncatedNum = Math.floor(adjustedNum);
	}

	return truncatedNum / multiplier;
};

export const chunkString = (s, maxBytes) => {
    const decoder = new TextDecoder('utf-8');
	const chunks = [];
    let buf = new TextEncoder('utf-8').encode(s);

    while (buf.length) {
        let i = buf.lastIndexOf(32, maxBytes+1);
        // If no space found, try forward search
        if (i < 0) i = buf.indexOf(32, maxBytes);
        // If there's no space at all, take all
        if (i < 0) i = buf.length;
        // This is a safe cut-off point; never half-way a multi-byte
        chunks.push(decoder.decode(buf.slice(0, i)));
        buf = buf.slice(i+1); // Skip space (if any)
    }

	return chunks;
}

export const isSymbolAddress = (address) => {
    if (typeof address !== 'string') {
        return false;
    }

    const addressTrimAndUpperCase = address.trim().toUpperCase().replace(/-/g, '');

    if (addressTrimAndUpperCase.length !== 39) {
        return false;
    }

    if (addressTrimAndUpperCase.charAt(0) !== 'T' && addressTrimAndUpperCase.charAt(0) !== 'N') {
        return false;
    }

    return true;
};
