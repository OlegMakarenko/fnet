import Modal from './Modal';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';
import RadioButton from './RadioButton';
import { useState } from 'react';

const amounts = [10, 50, 100, 500, 1000];

export const FormDonate = ({ isVisible, onClose, author}) => {
	const [amount, setAmount] = useState(amounts[0]);
	const data = { address: author.address, amount };

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.DONATE} data={data} onClose={onClose}>
				<div className="layout-flex-col-fields">
					{amounts.map((item, index) => (
						<RadioButton key={index} value={item === amount} onChange={() => setAmount(item)}>{item} XYM</RadioButton>
					))}
				</div>
			</FormTransaction>
		</Modal>
	);
};
