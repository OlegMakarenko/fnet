import Modal from './Modal';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

export const FormLikePost = ({ isVisible, onClose, postAccount}) => {
	const reaction = '👍';
	const data = { reaction };

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.LIKE} postAccount={postAccount} data={data} onClose={onClose}>
				<h4>{reaction}</h4>
			</FormTransaction>
		</Modal>
	);
};
