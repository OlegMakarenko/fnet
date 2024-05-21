import { PublicKey } from 'symbol-sdk';
import { SymbolFacade } from 'symbol-sdk/symbol';
import { networkTypeToNetworkIdentifier } from './transaction';

export const addressFromPublicKey = (publicKey, networkType) => {
    const facade = new SymbolFacade(networkTypeToNetworkIdentifier(networkType));
    const _publicKey = new PublicKey(publicKey);

    return facade.network.publicKeyToAddress(_publicKey).toString();
};
