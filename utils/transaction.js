import { requestSign, setTransaction } from 'sss-module';
import { ChronoUnit, Instant } from '@js-joda/core';
import { MAX_VALUE_SIZE, MESSAGE_TYPES, METADATA_KEYS } from '@/constants';
import { chunkString } from './format';
import symbolSdk from 'symbol-sdk';
import { sha3_256 } from 'js-sha3';
import { metadataUpdateValue } from 'symbol-sdk/src/symbol/metadata';
import { TransactionMapping, UInt64 } from 'old-symbol-sdk';
import config from '@/config';
const facade = new symbolSdk.facade.SymbolFacade('testnet');
const GENERATION_HASH = '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4';

export const networkTypeToNetworkIdentifier = (networkType) => {
    return (networkType === 152 || networkType === '152') ? 'testnet' : 'mainnet';
}

export const publicKeyToAddress = (publicKey, networkType) => {
    const facade = new symbolSdk.facade.SymbolFacade(networkTypeToNetworkIdentifier(networkType));
    const publicKeyArray = new symbolSdk.PublicKey(publicKey);

    return facade.network.publicKeyToAddress(publicKeyArray).toString();
}

export const createAccount = () => {
    const privateKey = symbolSdk.PrivateKey.random();
    const keyPair = new symbolSdk.facade.SymbolFacade.KeyPair(privateKey);
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
    const fields = {
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline().toString(),
        recipientAddress: accountAddress,
        mosaics: []
    }

    return createTransactionSendingOptions(transaction, fields);
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
    const fields = {
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline().toString(),
        recipientAddress: postAccount.address,
        message: message,
        mosaics: []
    }

    return createTransactionSendingOptions(transaction, fields);
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
    const fields = {
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline().toString(),
        recipientAddress: postAccount.address,
        message: message,
        mosaics: []
    }

    return createTransactionSendingOptions(transaction, fields);
}

export const createPostTransaction = (userPublicKey, postAccount, title, text) => {
    console.log({userPublicKey, postAccount, title, text})
    const titleMessage = {
        type: MESSAGE_TYPES.POST,
        index: 0,
        value: title,
    }

    const textChunks = chunkString(text, MAX_VALUE_SIZE);
    const textMessageList = textChunks.map((item, index) => ({
        type: MESSAGE_TYPES.POST,
        index: index + 1,
        value: item,
    }));
    console.log([titleMessage, ...textMessageList])
    const embeddedTransactionsFields = [];
    const embeddedTransactions = [];
    [titleMessage, ...textMessageList].forEach(message => {
        embeddedTransactions.push(facade.transactionFactory.createEmbedded({
            type: 'transfer_transaction_v1',
            recipientAddress: postAccount.address,
            signerPublicKey: userPublicKey,
            message: createTransactionMessage(JSON.stringify(message)),
            mosaics: []
        }));
        embeddedTransactionsFields.push({
            type: 'transfer_transaction_v1',
            recipientAddress: postAccount.address,
            signerPublicKey: userPublicKey,
            message: message,
            mosaics: []
        });
    });
    console.log({embeddedTransactionsFields})
    const merkleHash = facade.constructor.hashEmbeddedTransactions(embeddedTransactions);
    const transaction = facade.transactionFactory.create({
        type: 'aggregate_complete_transaction_v2',
        deadline: createTransactionDeadline(),
		transactionsHash: merkleHash,
		transactions: embeddedTransactions,
    });
    const fields = {
        type: 'aggregate_complete_transaction_v2',
        deadline: createTransactionDeadline().toString(),
        transactions: embeddedTransactionsFields
    }
    console.log({fields})
    return createTransactionSendingOptions(transaction, fields);
}

export const createAccountNameTransaction = (userPublicKey, targetAddress, currentName, newName) => {
    const encoder = new TextEncoder();
    const newValue = new Uint8Array([0, ...encoder.encode(newName || '')]);
    const originalValue = new Uint8Array([0, ...encoder.encode(currentName || '')]);
    const valueSizeDelta = currentName ? newValue.length - originalValue.length : newValue.length;
    const xorValueUint8Array = metadataUpdateValue(originalValue, newValue);
    const xorValue = new TextDecoder().decode(xorValueUint8Array)
    const scopedMetadataKey = encodeMetadataKey(METADATA_KEYS.ACCOUNT_NAME);

    const embeddedTransactionsFields = [];
    const embeddedTransactions = [];
    embeddedTransactions.push(facade.transactionFactory.createEmbedded({
        type: 'account_metadata_transaction_v1',
        signerPublicKey: userPublicKey,
        targetAddress,
        scopedMetadataKey: BigInt('0x' + scopedMetadataKey),
        value: xorValue,
        valueSizeDelta
    }));
    embeddedTransactionsFields.push({
        type: 'account_metadata_transaction_v1',
        signerPublicKey: userPublicKey,
        targetAddress,
        scopedMetadataKey,
        value: xorValue,
        valueSizeDelta
    })
    const merkleHash = facade.constructor.hashEmbeddedTransactions(embeddedTransactions);
    const transaction = facade.transactionFactory.create({
        type: 'aggregate_complete_transaction_v2',
        signerPublicKey: userPublicKey,
        deadline: createTransactionDeadline(),
        transactionsHash: merkleHash,
        transactions: embeddedTransactions
    });
    const fields = {
        type: 'aggregate_complete_transaction_v2',
        signerPublicKey: userPublicKey,
        deadline: createTransactionDeadline().toString(),
        transactions: embeddedTransactionsFields
    }

    return createTransactionSendingOptions(transaction, fields);
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
    const fields = {
        type: 'transfer_transaction_v1',
        deadline: createTransactionDeadline().toString(),
        recipientAddress: address,
        message: message,
        mosaics: [{
            ...xymAmount,
            mosaicId: xymAmount.mosaicId.toString()
        }]
    }

    return createTransactionSendingOptions(transaction, fields);
}

export const createTransactionSendingOptions = (transaction, fields) => {
    const payload = symbolSdk.utils.uint8ToHex(transaction.serialize());
    const uri = `web+symbol://transaction?data=${payload}&generationHash=${GENERATION_HASH}`;
    const sssTransaction = TransactionMapping.createFromPayload(payload);

    return {
        uri,
        fields,
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
    const tAddress = new symbolSdk.symbol.Address(address).bytes;

    return [...tAddress]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
}

export const signWithSSS = async (transaction) => {
    console.log('signWithSSS', transaction)
	// Get transaction fee multipliers
	// const nodeUrl = await getNodeUrl();
	// const feeMultipliers = await makeRequest(`${nodeUrl}/network/fees/transaction`);

	// Calculate average fee
	const fee = transaction.size * 100; // feeMultipliers.averageFeeMultiplier;
    transaction.maxFee = UInt64.fromUint(fee);
    console.log('tx with fee', transaction)
	// Request SSS to sign transaction
	setTransaction(transaction);
	const signedTransaction = await requestSign();
    console.log('signed fee', signedTransaction.payload);

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
