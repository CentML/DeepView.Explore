import { PropsWithChildren } from 'react';
import { TabGroup } from '@centml/ui';
import Header from './Header';

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex grow flex-col bg-gray-100 px-4">
				<TabGroup
					items={[
						{
							id: 'overview',
							triggerElement: 'Overview'
						},
						{
							id: 'profiling',
							triggerElement: 'Profiling'
						},
						{
							id: 'deployment',
							triggerElement: 'Deployment'
						},
						{
							id: 'environment',
							triggerElement: 'Environmental impact'
						}
					]}
					label="tab"
				>
					<div className="py-4">{children}</div>
				</TabGroup>
			</div>
		</div>
	);
};

export default Layout;
