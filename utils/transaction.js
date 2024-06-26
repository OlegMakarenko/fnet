import { requestSign, setTransaction } from 'sss-module';
import { ChronoUnit, Instant } from '@js-joda/core';
import { MAX_MESSAGE_BYTE_SIZE, MAX_MESSAGE_VALUE_SIZE, MESSAGE_TYPES, METADATA_KEYS } from '@/constants';
import { chunkString, splitUint8Array } from './format';
import { PrivateKey, PublicKey, utils } from 'symbol-sdk';
import { Address, metadataUpdateValue, SymbolFacade } from 'symbol-sdk/symbol';
import { TransactionMapping, UInt64 } from 'old-symbol-sdk';
import { sha3_256 } from 'js-sha3';
import config from '@/config';

// TODO: remove
const facade = new SymbolFacade('testnet');
const GENERATION_HASH = '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4';

export const networkTypeToNetworkIdentifier = (networkType) => {
    return (Number(networkType) === 152) ? 'testnet' : 'mainnet';
}

export const publicKeyToAddress = (publicKey) => {
    const facade = new SymbolFacade(networkTypeToNetworkIdentifier(config.NETWORK_TYPE));
    const publicKeyArray = new PublicKey(publicKey);

    return facade.network.publicKeyToAddress(publicKeyArray).toString();
}

export const createAccount = () => {
    const privateKey = PrivateKey.random();
    const keyPair = new SymbolFacade.KeyPair(privateKey);
    const address = facade.network.publicKeyToAddress(keyPair.publicKey);

    return {
        address: address.toString()
    }
}

export const createAccountActivationTransaction = (accountAddress) => {
    const transaction = facade.transactionFactory.create({
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline(),
        recipientAddress: accountAddress,
        mosaics: []
    });

    return createTransactionSendingOptions(transaction);
}

export const createLikeTransaction = (postAccount, reaction) => {
    const message = {
        type: MESSAGE_TYPES.LIKE,
        index: 0,
        value: reaction,
    }
    const transaction = facade.transactionFactory.create({
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline(),
        recipientAddress: postAccount.address,
        message: createTransactionMessage(JSON.stringify(message)),
        mosaics: []
    });

    return createTransactionSendingOptions(transaction);
}

export const createCommentTransaction = (postAccount, text) => {
    const message = {
        type: MESSAGE_TYPES.COMMENT,
        index: 0,
        value: text,
    }
    const transaction = facade.transactionFactory.create({
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline(),
        recipientAddress: postAccount.address,
        message: createTransactionMessage(JSON.stringify(message)),
        mosaics: []
    });

    return createTransactionSendingOptions(transaction);
}

export const createPostTransaction = (userPublicKey, postAccount, title, text) => {
    const titleMessage = {
        type: MESSAGE_TYPES.POST,
        index: 0,
        value: title,
    }

    const textChunks = chunkString(text, MAX_MESSAGE_VALUE_SIZE);
    const textMessageList = textChunks.map((item, index) => ({
        type: MESSAGE_TYPES.POST,
        index: index + 1,
        value: item,
    }));

    const embeddedTransactions = [];
    [titleMessage, ...textMessageList].forEach(message => {
        embeddedTransactions.push(facade.transactionFactory.createEmbedded({
            type: 'transfer_transaction_v1',
            recipientAddress: postAccount.address,
            signerPublicKey: userPublicKey,
            message: createTransactionMessage(JSON.stringify(message)),
            mosaics: []
        }));
    });

    const merkleHash = facade.constructor.hashEmbeddedTransactions(embeddedTransactions);
    const transaction = facade.transactionFactory.create({
        type: 'aggregate_complete_transaction_v2',
        deadline: createTransactionDeadline(),
		transactionsHash: merkleHash,
		transactions: embeddedTransactions,
    });

    return createTransactionSendingOptions(transaction);
}

export const createAccountNameTransaction = (userPublicKey, targetAddress, currentName, newName, currentBio, newBio) => {
    const encoder = new TextEncoder();
    const newNameValue = new Uint8Array([0, ...encoder.encode(newName || '')]);
    const originalNameValue = new Uint8Array([0, ...encoder.encode(currentName || '')]);
    const nameValueSizeDelta = currentName ? newNameValue.length - originalNameValue.length : newNameValue.length;
    const xorNameValueUint8Array = metadataUpdateValue(originalNameValue, newNameValue);
    const xorNameValue = new TextDecoder().decode(xorNameValueUint8Array)
    const nameScopedMetadataKey = encodeMetadataKey(METADATA_KEYS.ACCOUNT_NAME);

    const newBioValue = new Uint8Array([0, ...encoder.encode(newBio || '')]);
    const originalBioValue = new Uint8Array([0, ...encoder.encode(currentBio || '')]);
    const bioValueSizeDelta = currentBio ? newBioValue.length - originalBioValue.length : newBioValue.length;
    const xorBioValueUint8Array = metadataUpdateValue(originalBioValue, newBioValue);
    const xorBioValue = new TextDecoder().decode(xorBioValueUint8Array)
    const bioScopedMetadataKey = encodeMetadataKey(METADATA_KEYS.ACCOUNT_BIO);

    const embeddedTransactions = [];
    embeddedTransactions.push(facade.transactionFactory.createEmbedded({
        type: 'account_metadata_transaction_v1',
        signerPublicKey: userPublicKey,
        targetAddress,
        scopedMetadataKey: BigInt('0x' + nameScopedMetadataKey),
        value: xorNameValue,
        valueSizeDelta: nameValueSizeDelta
    }));
    embeddedTransactions.push(facade.transactionFactory.createEmbedded({
        type: 'account_metadata_transaction_v1',
        signerPublicKey: userPublicKey,
        targetAddress,
        scopedMetadataKey: BigInt('0x' + bioScopedMetadataKey),
        value: xorBioValue,
        valueSizeDelta: bioValueSizeDelta
    }));
    const merkleHash = facade.constructor.hashEmbeddedTransactions(embeddedTransactions);
    const transaction = facade.transactionFactory.create({
        type: 'aggregate_complete_transaction_v2',
        signerPublicKey: userPublicKey,
        deadline: createTransactionDeadline(),
        transactionsHash: merkleHash,
        transactions: embeddedTransactions
    });

    return createTransactionSendingOptions(transaction);
}

export const createDonationTransaction = (address, amount) => {
    const message = {
        type: MESSAGE_TYPES.DONATE,
    }
    const xymAmount = createXYMAmount(amount);
    const transaction = facade.transactionFactory.create({
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline(),
        recipientAddress: address,
        message: createTransactionMessage(JSON.stringify(message)),
        mosaics: [xymAmount]
    });

    return createTransactionSendingOptions(transaction);
}

export const createGalleryImageTransaction = (userPublicKey, image) => {
    const userAddress = publicKeyToAddress(userPublicKey)
    const headerMessage = {
        type: MESSAGE_TYPES.GALLERY_IMAGE,
    }
    const imageUint8ArrayChunks = splitUint8Array(image, MAX_MESSAGE_BYTE_SIZE);

    // TODO: handle the max number of embedded transactions
    // if (imageUint8ArrayChunks.length > 99) console.error('Too many txs')

    const embeddedTransactions = [];
    embeddedTransactions.push(facade.transactionFactory.createEmbedded({
        type: 'transfer_transaction_v1',
        recipientAddress: userAddress,
        signerPublicKey: userPublicKey,
        message: createTransactionMessage(JSON.stringify(headerMessage)),
        mosaics: []
    }));
    imageUint8ArrayChunks.forEach(messageUint8Array => {
        const messageUint8ArrayWithType = new Uint8Array([123, ...messageUint8Array]);

        embeddedTransactions.push(facade.transactionFactory.createEmbedded({
            type: 'transfer_transaction_v1',
            recipientAddress: userAddress,
            signerPublicKey: userPublicKey,
            message: messageUint8ArrayWithType,
            mosaics: []
        }));
    });

    const merkleHash = facade.constructor.hashEmbeddedTransactions(embeddedTransactions);
    const transaction = facade.transactionFactory.create({
        type: 'aggregate_complete_transaction_v2',
        deadline: createTransactionDeadline(),
		transactionsHash: merkleHash,
		transactions: embeddedTransactions,
        signerPublicKey: userPublicKey,
    });

    return createTransactionSendingOptions(transaction);
}

export const createTransactionSendingOptions = (transaction) => {
    const payload = utils.uint8ToHex(transaction.serialize());
    const uri = `web+symbol://transaction?data=${payload}&generationHash=${GENERATION_HASH}`;
    const sssTransaction = TransactionMapping.createFromPayload(payload);

    return {
        uri,
        payload,
        sssTransaction
    }
}

export const createTransactionMessage = (text) => {
    const textEncoder = new TextEncoder();

    return new Uint8Array([0, ...textEncoder.encode(text)])
}

export const decodeTransactionMessage = (text) => {
    return Buffer.from(text.substring(2), 'hex').toString();
}

export const encodeMetadataKey = (key) => {
    const buf = sha3_256.arrayBuffer(key);
    const result = new Uint32Array(buf);
    const uint64 = [result[0], (result[1] | 0x80000000) >>> 0];
    const uint32Array = new Uint32Array(uint64);
    const uint8Array = new Uint8Array(uint32Array.buffer).reverse();

    return [...uint8Array]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

export const encodeAddress = (address) => {
    const tAddress = new Address(address).bytes;

    return [...tAddress]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

export const decodeAddress = (address) => {
    const tAddress = new Address(Buffer.from(address, 'hex')).toString()
    return tAddress;
}

export const signWithSSS = async (transaction) => {
	// Get transaction fee multipliers

    // TODO: fetch fees from the API
	// const nodeUrl = await getNodeUrl();
	// const feeMultipliers = await makeRequest(`${nodeUrl}/network/fees/transaction`);
    // const fee = transaction.size * feeMultipliers.averageFeeMultiplier;

	// Calculate average fee
	const fee = transaction.size * 150; // feeMultipliers.averageFeeMultiplier;
    transaction.maxFee = UInt64.fromUint(fee);

	// Request SSS to sign transaction
	setTransaction(transaction);
	const signedTransaction = await requestSign();

	return signedTransaction.payload;
};

export const createTransactionDeadline = () => {
    const deadlineDateTime = Instant.now().plus(2, ChronoUnit.HOURS);
    const deadline = deadlineDateTime.minusSeconds(config.EPOCH_ADJUSTMENT).toEpochMilli();

    return BigInt(deadline);
}

export const formatTimestamp = (timestamp) => timestamp ? new Date((+timestamp) + config.EPOCH_ADJUSTMENT * 1000).toISOString() : null;

export const createXYMAmount = (amount) => {
    return {
        mosaicId: BigInt(`0x${config.NATIVE_MOSAIC_ID}`),
        amount: BigInt(Math.pow(10, config.NATIVE_MOSAIC_DIVISIBILITY) * amount)
    }
}
