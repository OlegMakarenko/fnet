export const METADATA_KEYS = {
	ACCOUNT_NAME: 'fnet_account_name',
	ACCOUNT_BIO: 'fnet_account_bio'
}

export const SENDING_OPTIONS = {
	TRANSACTION_URI: 'TRANSACTION_URI',
	PRINT_PAYLOAD: 'PRINT_PAYLOAD',
	SSS: 'SSS',
    SYMBOL_EXTENSION: 'SYMBOL_EXTENSION',
}

export const STORAGE_KEY = {
	USER_ADDRESS: 'USER_ADDRESS',
	SENDING_OPTION: 'SENDING_OPTION',
	BOOKMARKS_AUTHORS: 'BOOKMARKS_AUTHORS',
	TIMESTAMP_TYPE: 'TIMESTAMP_TYPE',
	USER_LANGUAGE: 'USER_LANGUAGE',
	USER_CURRENCY: 'USER_CURRENCY'
};

export const MESSAGE_TYPES = {
    POST: 1,
    COMMENT: 2,
    LIKE: 3,
	ACCOUNT_NAME: 4,
	ACCOUNT_ACTIVATION: 5,
	DONATE: 6,
	GALLERY_IMAGE: 100
}

export const MAX_MESSAGE_VALUE_SIZE = 900;

export const MAX_MESSAGE_BYTE_SIZE = 1023;

export const MAX_IMAGE_SIZE_KB = 95;

export const TransactionType = {
    RESERVED: 0,
    TRANSFER: 16724,
    NAMESPACE_REGISTRATION: 16718,
    ADDRESS_ALIAS: 16974,
    MOSAIC_ALIAS: 17230,
    MOSAIC_DEFINITION: 16717,
    MOSAIC_SUPPLY_CHANGE: 16973,
    MOSAIC_SUPPLY_REVOCATION: 17229,
    MULTISIG_ACCOUNT_MODIFICATION: 16725,
    AGGREGATE_COMPLETE: 16705,
    AGGREGATE_BONDED: 16961,
    HASH_LOCK: 16712,
    SECRET_LOCK: 16722,
    SECRET_PROOF: 16978,
    ACCOUNT_ADDRESS_RESTRICTION: 16720,
    ACCOUNT_MOSAIC_RESTRICTION: 16976,
    ACCOUNT_OPERATION_RESTRICTION: 17232,
    ACCOUNT_KEY_LINK: 16716,
    MOSAIC_ADDRESS_RESTRICTION: 16977,
    MOSAIC_GLOBAL_RESTRICTION: 16721,
    ACCOUNT_METADATA: 16708,
    MOSAIC_METADATA: 16964,
    NAMESPACE_METADATA: 17220,
    VRF_KEY_LINK: 16963,
    VOTING_KEY_LINK: 16707,
    NODE_KEY_LINK: 16972,
};
