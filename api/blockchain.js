import config from '@/config';
import { makeRequest } from '@/utils';

export const fetchNodeList = async () => {
    try {
        const nodes = await makeRequest(config.NODELIST_URL);

        return nodes.map((node) => node.apiStatus.restGatewayUrl);
    }
    catch(error) {
        console.error('Error: [blockchain] failed to fetch node list. Use default', error.message);
        return config.DEFAULT_NODES;
    }
}

export const getNodeUrl = async () => {
    const nodes = await fetchNodeList();

    return nodes[Math.floor(Math.random() * nodes.length)];
}

export const announceTransaction = async (transactionPayload) => {
    const nodes = await fetchNodeList();

    return Promise.all(
		nodes.map(node => {
			const endpoint = `${node}/transactions`;
            const payload = {
                payload: transactionPayload,
            };

            return makeRequest(endpoint, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
		})
	);
}
