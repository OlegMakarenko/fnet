import config from '@/config';
import { decodeTransactionMessage, encodeAddress, encodeMetadataKey, makeRequest, publicKeyToAddress, truncateDecimals } from '@/utils';
import { getNodeUrl } from './blockchain';
import { METADATA_KEYS } from '@/constants';

export const fetchAccountName = async address => {
	const nodeUrl = await getNodeUrl();
	let metadata;

	try {
		metadata = await makeRequest(`${nodeUrl}/metadata?targetAddress=${address}&pageSize=100&pageNumber=1&order=desc&metadataType=0`);
	}
	catch {}

	if (!metadata?.data[0]) {
		return null;
	}

	const scopedMetadataKey = encodeMetadataKey(METADATA_KEYS.ACCOUNT_NAME);
	const encodedAddress = encodeAddress(address);

	const nameMetadata = metadata.data.find(metadata => (
		metadata.metadataEntry.sourceAddress === encodedAddress
		&& metadata.metadataEntry.targetAddress === encodedAddress
		&& metadata.metadataEntry.scopedMetadataKey === scopedMetadataKey
	));

	if (!nameMetadata) {
		return null;
	}

	const name = decodeTransactionMessage(nameMetadata.metadataEntry.value);

	return name;
};

export const fetchAccountPublicKey = async address => {
	const nodeUrl = await getNodeUrl();
	let publicKey = null;

	try {
		const accountInfo = await makeRequest(`${nodeUrl}/accounts/${address}`);
		publicKey = accountInfo.account.publicKey ==='0000000000000000000000000000000000000000000000000000000000000000'
			? null : accountInfo.account.publicKey;
	}
	catch {}

	return publicKey;
};
