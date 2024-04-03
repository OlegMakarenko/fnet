import { createPage, decodeTransactionMessage, formatTimestamp, hexToBase64, makeRequest, publicKeyToAddress } from '@/utils';
import { fetchNodeList, getNodeUrl } from './blockchain';
import { MESSAGE_TYPES, TransactionType } from '@/constants';

export const fetchAccountImagePage = async (searchCriteria, author) => {
	const { pageNumber } = searchCriteria;
	const nodeUrl = await getNodeUrl();
	const nodeList = await fetchNodeList();

	let url = `${nodeUrl}/transactions/confirmed?type=${TransactionType.AGGREGATE_COMPLETE}&pageSize=100&pageNumber=${pageNumber}&order=desc`;

	if (author) {
		url = url + `&signerPublicKey=${author.publicKey}`;
	}

	const aggregateTransactions = await makeRequest(url);
	const aggregateTransactionDetails = await Promise.all(aggregateTransactions.data.map(transaction => {
		const nodeUrl = nodeList[Math.floor(Math.random() * nodeList.length)];
		const { hash } = transaction.meta;

		return makeRequest(`${nodeUrl}/transactions/confirmed/${hash}`);
	}));

	const images = [];
	aggregateTransactionDetails.forEach((transactionContainer) => {
        const { transaction, meta } = transactionContainer;
		try {
            const headerTransaction = transaction.transactions[0].transaction;
            const headerMessage = JSON.parse(decodeTransactionMessage(headerTransaction.message));
            if (headerMessage.type !== MESSAGE_TYPES.GALLERY_IMAGE) throw Error('Invalid message type');
        }
        catch {
            return
        }

        let hex = '';
        transaction.transactions.slice(1).forEach(tx => {
            hex += tx.transaction.message.substring(2);
        });

        const base64 = hexToBase64(hex);

        images.push({
            base64: `data:image/png;base64,${base64}`,
            timestamp: formatTimestamp(meta.timestamp),
            hash: meta.hash
        })
	});

	return createPage(images, pageNumber);
};
