import { Loader2 } from 'lucide-react';

// loader
export default function Loader() {
	return (
		<div className="flex justify-center">
			<Loader2 className="size-24 animate-spin" />
		</div>
	);
}
