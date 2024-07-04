import { PropsWithChildren } from 'react';
import { Container, Nav as BootstrapNav, Tab } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';

const TABS = ['overview', 'profiling', 'deployment', 'environmental impact'] as const;
export type TAB = (typeof TABS)[number];

const Nav = () => {
	return (
		<BootstrapNav variant="underline" className="bg-surface-500">
			<Container className="flex items-center justify-between px-4" fluid>
				<div className="flex items-center gap-4 pt-2">
					{TABS.map((tab) => (
						<BootstrapNav.Item key={tab} className="[&>.active]:!border-surface-100 [&>a:hover]:!border-surface-100">
							<BootstrapNav.Link className="capitalize text-white" eventKey={tab}>
								{tab}
							</BootstrapNav.Link>
						</BootstrapNav.Item>
					))}
				</div>
				<a href="https://docs.centml.ai/" rel="noreferrer" target="_blank" title="help">
					<Icon icon={faQuestionCircle} className="h-5" color="#ffffff" aria-label="help" />
				</a>
			</Container>
		</BootstrapNav>
	);
};

export interface TabPanelProps extends PropsWithChildren {
	name: TAB;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, name }: TabPanelProps) => {
	return <Tab.Pane eventKey={name}>{children}</Tab.Pane>;
};

interface LayoutProps extends PropsWithChildren {
	defaultTab?: TAB;
}

const Layout = ({ children, defaultTab = 'overview' }: LayoutProps) => {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex grow flex-col">
				<Tab.Container mountOnEnter defaultActiveKey={defaultTab} transition={false}>
					<Nav />
					<Tab.Content className="flex-1 bg-surface-100 px-6 py-4">{children}</Tab.Content>
				</Tab.Container>
			</div>
		</div>
	);
};

export default Layout;
