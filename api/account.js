import config from '@/config';
import { decodeTransactionMessage, encodeAddress, encodeMetadataKey, makeRequest } from '@/utils';
import { getNodeUrl } from './blockchain';
import { METADATA_KEYS } from '@/constants';

export const fetchAuthorInfo = async address => {
	const nodeUrl = await getNodeUrl();
	let metadata;

	const info = {
		name: '',
		bio: ''
	}

	try {
		metadata = await makeRequest(`${nodeUrl}/metadata?targetAddress=${address}&pageSize=100&pageNumber=1&order=desc&metadataType=0`);
	}
	catch {}

	if (!metadata?.data[0]) {
		return info;
	}

	const nameScopedMetadataKey = encodeMetadataKey(METADATA_KEYS.ACCOUNT_NAME);
	const bioScopedMetadataKey = encodeMetadataKey(METADATA_KEYS.ACCOUNT_BIO);
	const encodedAddress = encodeAddress(address);

	const nameMetadata = metadata.data.find(metadata => (
		metadata.metadataEntry.sourceAddress === encodedAddress
		&& metadata.metadataEntry.targetAddress === encodedAddress
		&& metadata.metadataEntry.scopedMetadataKey === nameScopedMetadataKey
	));
	const bioMetadata = metadata.data.find(metadata => (
		metadata.metadataEntry.sourceAddress === encodedAddress
		&& metadata.metadataEntry.targetAddress === encodedAddress
		&& metadata.metadataEntry.scopedMetadataKey === bioScopedMetadataKey
	));

	if (nameMetadata) {
		info.name = decodeTransactionMessage(nameMetadata.metadataEntry.value);
	}
	if (bioMetadata) {
		info.bio = decodeTransactionMessage(bioMetadata.metadataEntry.value);
	}

	return info;
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
