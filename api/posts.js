import config from '@/config';
import { createAPICallFunction, createPage, decodeAddress, decodeTransactionMessage, formatTimestamp, makeRequest, publicKeyToAddress } from '@/utils';
import { fetchNodeList, getNodeUrl } from './blockchain';
import { MESSAGE_TYPES } from '@/constants';

const fetchAllPages = async (fetchFn, maxPages = 25) => {
	let isLastPage = false;
	let pageNumber = 1;
	const finalData = [];

	while (!isLastPage && pageNumber <= maxPages) {
		const { data } = await fetchFn(pageNumber);
		pageNumber = pageNumber + 1;
		isLastPage = data.length === 0;
		finalData.push(...data);
	}

	return finalData;
}

export const fetchPostInfo = createAPICallFunction(async address => {
	const nodeUrl = await getNodeUrl();
	const transactions = await makeRequest(`${nodeUrl}/transactions/confirmed?address=${address}&type=&pageSize=1&pageNumber=1&order=asc`);
	let isUnconfirmed = false;

	if (!transactions.data[0]) {
		const transactionsUnconfirmed = await makeRequest(`${nodeUrl}/transactions/unconfirmed?address=${address}&type=&pageSize=1&pageNumber=1&order=asc`);
		transactions.data.push(...transactionsUnconfirmed.data);
		isUnconfirmed = true;
	}

	if (!transactions.data[0]) {
		return null;
	}

	const transactionGroup = isUnconfirmed ? 'unconfirmed' : 'confirmed';
	const firstTransactionHash = transactions.data[0].meta.hash;
	const { transaction, meta } = await makeRequest(`${nodeUrl}/transactions/${transactionGroup}/${firstTransactionHash}`);
	const [titleMessage, ...textMessages] = transaction.transactions.map(tx =>
		JSON.parse(decodeTransactionMessage(tx.transaction.message))
	);

	const title = titleMessage.value;
	const text = textMessages.map(message => message.value).join(' ');
	const timestamp = formatTimestamp(meta.timestamp);

	const authorPublicKey = transaction.signerPublicKey;
	const authorAddress = publicKeyToAddress(authorPublicKey, config.NETWORK_TYPE);

	return {
		author: {
			publicKey: authorPublicKey,
			address: authorAddress,
			name: null
		},
		post: {
			title,
			text,
			timestamp,
		},
		postAccount: {
			address
		}
	};
});

export const fetchPostHistory = async (postAddress, author) => {
	const nodeUrl = await getNodeUrl();
	const transactions = await fetchAllPages(pageNumber => makeRequest(`${nodeUrl}/transactions/confirmed?signerPublicKey=${author.publicKey}&recipientAddress=${postAddress}&type=16724&pageSize=500&pageNumber=${pageNumber}&order=desc&embedded=true`));

	return formatPostTransactions(transactions);
};

export const fetchPostActivity = async (postAddress) => {
	const nodeUrl = await getNodeUrl();
	const [confirmedTransactions, unconfirmedTransactions] = await Promise.all([
		makeRequest(`${nodeUrl}/transactions/confirmed?address=${postAddress}&type=16724&pageSize=500&pageNumber=1&order=desc`),
		makeRequest(`${nodeUrl}/transactions/unconfirmed?address=${postAddress}&type=16724&pageSize=500&pageNumber=1&order=desc`),
	]);

	const transactions = [...unconfirmedTransactions.data, ...confirmedTransactions.data]
	const likesMap = {};
	const comments = [];

	for (const transactionContainer of transactions) {
		const { transaction, meta } = transactionContainer;
		const message = JSON.parse(decodeTransactionMessage(transaction.message));
		const timestamp = formatTimestamp(meta.timestamp);

		if (message.type == MESSAGE_TYPES.LIKE) {
			const authorAddress = publicKeyToAddress(transaction.signerPublicKey, config.NETWORK_TYPE);
			likesMap[authorAddress] = {
				timestamp,
				reaction: message.value,
				authorAddress
			};
		}
		if (message.type == MESSAGE_TYPES.COMMENT) {
			comments.push({
				timestamp,
				text: message.value,
				author: {
					address: publicKeyToAddress(transaction.signerPublicKey, config.NETWORK_TYPE),
					publicKey: transaction.signerPublicKey,
				}
			});

		}
	}

	const likes = Object.values(likesMap);

	return {
		likes,
		comments
	};
};

export const fetchAccountPostPage = async (searchCriteria, author) => {
	const { pageNumber } = searchCriteria;
	const nodeUrl = await getNodeUrl();
	let url = `${nodeUrl}/transactions/confirmed?type=16724&pageSize=500&pageNumber=${pageNumber}&order=desc&embedded=true`;

	if (author) {
		url = url + `&signerPublicKey=${author.publicKey}`;
	}

	const transactions = await makeRequest(url);
	const posts = formatPostTransactions(transactions.data);

	return createPage(posts, pageNumber);
};

export const fetchRecentPostPage = async (searchCriteria) => {
	const aggregateTransactionType = 16705;
	const transferTransactionType = 16724;
	const { pageNumber } = searchCriteria;
	const nodeUrl = await getNodeUrl();
	const nodeList = await fetchNodeList();
	const aggregateTransactions = await makeRequest(`${nodeUrl}/transactions/confirmed?type=${aggregateTransactionType}&pageSize=100&pageNumber=${pageNumber}&order=desc`);

	const aggregateTransactionDetails = await Promise.all(aggregateTransactions.data.map(transaction => {
		const nodeUrl = nodeList[Math.floor(Math.random() * nodeList.length)];
		const { hash } = transaction.meta;

		return makeRequest(`${nodeUrl}/transactions/confirmed/${hash}`);
	}));

	const transactions = [];

	aggregateTransactionDetails.forEach((transaction) => {
		const innerTransfers = transaction.transaction.transactions.filter((innerTransaction) => innerTransaction.transaction.type === transferTransactionType);

		transactions.push(...innerTransfers);
	});

	const posts = formatPostTransactions(transactions);

	return createPage(posts, pageNumber);
};

const formatPostTransactions = (transactions) => {
	if (!transactions.length) {
		return [];
	}

	const postMap = {};

	for (const transactionContainer of transactions) {
		const { transaction, meta } = transactionContainer;
		const hash = meta.aggregateHash;
		const decodedMessage = decodeTransactionMessage(transaction.message || '');
		let message;

		try {
			message = JSON.parse(decodedMessage);
		}
		catch {
			continue;
		}

		if (message.type !== MESSAGE_TYPES.POST) {
			continue;
		}

		if (!postMap.hasOwnProperty(hash)) {
			postMap[hash] = {
				timestamp: formatTimestamp(meta.timestamp),
				messages: [],
				address: decodeAddress(transaction.recipientAddress),
				author: {
					publicKey: transaction.signerPublicKey,
					address: publicKeyToAddress(transaction.signerPublicKey, config.NETWORK_TYPE)
				}
			}
		}

		postMap[hash].messages[message.index] = message.value;
	}

	const posts = Object.values(postMap).map(post => {
		const [titleMessage, ...textMessages] = post.messages;

		return {
			address: post.address,
			title: titleMessage,
			text: textMessages.join(' '),
			timestamp: post.timestamp,
			author: post.author
		}
	})

	return posts;
};
