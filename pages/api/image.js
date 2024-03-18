import config from '@/config';
import { decodeTransactionMessage, makeRequest, mergeUint8Arrays } from '@/utils';
import { getNodeUrl } from '../../api/blockchain';
import { MESSAGE_TYPES, TransactionType } from '@/constants';

export default async function handler(req, res) {
	if (req.method !== 'GET') {
		return;
	}

	const { hash } = req.query;

    console.log('hash', hash)

    if (!hash || hash.length !== 64) {
        res.status(400).send('Invalid hash value');
    }

    const nodeUrl = await getNodeUrl();

    let transaction;

    try {
        const response = await makeRequest(`${nodeUrl}/transactions/confirmed/${hash}`);
        transaction = response.transaction;
    }
    catch {}

    console.log('transaction', transaction)

    if (!transaction || transaction.type !== TransactionType.AGGREGATE_COMPLETE) {
        res.status(404).send('Image not found');
        return;
    }

    try {
        const headerTransaction = transaction.transactions[0].transaction;
        const headerMessage = JSON.parse(decodeTransactionMessage(headerTransaction.message));
        if (headerMessage.type !== MESSAGE_TYPES.GALLERY_IMAGE) throw Error();
    }
    catch {
        res.status(404).send('Image not found');
    }

	const messages = transaction.transactions.slice(1).map(tx => {
        return new Uint32Array(Buffer.from(tx.transaction.message, 'hex'));
    });

    const ascii = mergeUint8Arrays(messages);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(ascii, 'binary');
}
