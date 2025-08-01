'use client';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { DeleteOrder } from '../../_actions/orders';

// delete dropdown action
export function DeleteDropdownItem({ id }: { id: string }) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	return (
		<DropdownMenuItem
			variant="destructive"
			disabled={isPending}
			onClick={() => {
				startTransition(async () => {
					await DeleteOrder(id);
					router.refresh();
				});
			}}
		>
			Delete
		</DropdownMenuItem>
	);
}
