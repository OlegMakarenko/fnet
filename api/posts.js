import config from '@/config';
import { createAPICallFunction, decodeTransactionMessage, formatTimestamp, makeRequest, publicKeyToAddress } from '@/utils';
import { getNodeUrl } from './blockchain';
import { MESSAGE_TYPES } from '@/constants';

const fetchAllPages = async (fetchFn) => {
	const MAX_PAGES = 25;
	let isLastPage = false;
	let pageNumber = 1;
	const finalData = [];

	while (!isLastPage || pageNumber >= MAX_PAGES) {
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
	const postMap = {};

	for (const transactionContainer of transactions) {
		const { transaction, meta } = transactionContainer;
		const hash = meta.aggregateHash;
		const message = JSON.parse(decodeTransactionMessage(transaction.message))

		if (message.type !== MESSAGE_TYPES.POST) {
			continue;
		}

		if (!postMap.hasOwnProperty(hash)) {
			postMap[hash] = {
				timestamp: meta.timestamp,
				messages: []
			}
		}

		postMap[hash].messages[message.index] = message.value;
	}

	const posts = Object.values(postMap).map(post => {
		const [titleMessage, ...textMessages] = post.messages;

		return {
			title: titleMessage,
			text: textMessages.join(' '),
			timestamp: formatTimestamp(post.timestamp)
		}
	})

	return posts;
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
				authorAddress: publicKeyToAddress(transaction.signerPublicKey, config.NETWORK_TYPE),
			});

		}
	}

	const likes = Object.values(likesMap);

	return {
		likes,
		comments
	};
};
