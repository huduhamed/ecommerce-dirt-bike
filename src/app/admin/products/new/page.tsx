import { PageHeader } from '../../_components/PageHeader';
import { ProductForm } from '../_components/ProductForm';

// add product page
export default function NewProductPage() {
	return (
		<>
			<PageHeader>Add Product</PageHeader>
			<ProductForm />
		</>
	);
}
