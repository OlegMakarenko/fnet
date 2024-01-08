import Modal from './Modal';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

export const FormAccountActivation = ({ isVisible, onClose, accountAddress }) => {
	const data = { accountAddress };

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.ACCOUNT_ACTIVATION} data={data} onClose={onClose}>
				You need to send at least one transaction from your account to activate it.
			</FormTransaction>
		</Modal>
	);
};
