export const SITE_URL = 'https://srthkpthk.github.io';

export const siteConfig = {
	name: 'Srthk Pthk',
	tagline: 'Software Engineer',
	email: 'srthk.pthk4@gmail.com',
	social: {
		github: 'https://github.com/srthkpthk',
		linkedin: 'https://www.linkedin.com/in/srthk-pthk/',
		twitter: 'https://twitter.com/SrthkPthk'
	}
};

export const heroContent = {
	greeting: "Hi, I'm",
	name: 'Sarthak Pathak',
	tagline: 'I architect cloud-native systems & ship products at scale.'
};

export const aboutContent = {
	sectionNumber: '01',
	heading: 'About',
	paragraphs: [
		'Software Engineer at Grappus with 4+ years of experience specializing in cloud-native architecture and scalable backend systems. Expert in the Java Spring ecosystem, AWS/Azure/GCP, and microservices design.',
		'I build things that matter — from migrating complex streaming services to the cloud, to developing AI-powered bots using RAG architecture, to shipping backends supporting 140,000+ app downloads across fintech, politics, and entertainment.',
		'Proven technical leader managing teams of 3-5 developers using Agile methodologies, consistently delivering ahead of schedule with 4.6+ star ratings and sub-100ms response times.'
	]
};

export const skillsContent = {
	sectionNumber: '02',
	heading: 'Skills',
	subheading: 'Technologies I work with',
	skills: [
		{ name: 'Java / Spring Boot', level: 95 },
		{ name: 'AWS / Azure / GCP', level: 90 },
		{ name: 'Docker / Kubernetes', level: 85 },
		{ name: 'Terraform / IaC', level: 85 },
		{ name: 'Node.js', level: 80 },
		{ name: 'PostgreSQL', level: 80 },
		{ name: 'Kafka', level: 75 },
		{ name: 'LangChain / RAG', level: 80 }
	]
};

export const educationContent = {
	heading: 'Education',
	timeline: [
		{
			degree: '10th Standard',
			institution: 'CBSE',
			location: '',
			year: '2015'
		},
		{
			degree: '12th Standard',
			institution: 'CBSE',
			location: '',
			year: '2017'
		},
		{
			degree: 'B.Tech/B.E. — Computers',
			institution: 'G L Bajaj Institute of Technology & Management',
			location: 'Greater Noida',
			year: '2021'
		}
	]
};

export interface Project {
	number: string;
	slug: string;
	title: string;
	description: string;
	longDescription: string[];
	tech: string[];
	features: string[];
	links: {
		github?: string;
		demo?: string;
	};
	role: string;
	year: string;
	gradient: string;
}

export const projectsContent = {
	sectionNumber: '03',
	heading: 'Projects',
	projects: [
		{
			number: '01',
			slug: 'protean-ai-bot',
			title: 'Protean AI Bot',
			description:
				'Intelligent Agentic Bot using RAG architecture with LangChain and MCP server integration.',
			longDescription: [
				'Protean AI Bot is an intelligent agentic customer support system built on RAG (Retrieval-Augmented Generation) architecture with LangChain and MCP server integration.',
				'The bot implements semantic search and automated response generation capabilities, creating a sophisticated AI-powered support system that understands context and delivers accurate, relevant answers.',
				'Successfully reduced manual support overhead by 60%, demonstrating significant operational efficiency improvements through advanced AI integration.'
			],
			tech: ['LangChain', 'RAG', 'MCP', 'Semantic Search', 'Python'],
			features: [
				'RAG architecture for context-aware response generation',
				'MCP server integration for tool use and agentic capabilities',
				'Semantic search across knowledge bases',
				'Automated response generation with high accuracy',
				'60% reduction in manual support overhead'
			],
			links: {},
			role: 'Software Engineer',
			year: '2024',
			gradient: 'from-violet-500/10 to-cyan-500/10'
		},
		{
			number: '02',
			slug: 'quickflip',
			title: 'Quickflip',
			description:
				'Complete AWS cloud migration for Quidich streaming service with scalable microservices architecture.',
			longDescription: [
				"Quickflip involved migrating Quidich's entire streaming service infrastructure to AWS cloud, architecting the complete system from scratch with a scalable microservices design.",
				'The entire infrastructure was coded using Terraform IaC, deploying ECS for container orchestration, Lambda for serverless compute, and SQS for asynchronous message processing.',
				'Achieved sub-100ms response times for automated request processing, ensuring high-performance streaming capabilities for end users.'
			],
			tech: ['AWS', 'Terraform', 'ECS', 'Lambda', 'SQS', 'Microservices'],
			features: [
				'Complete cloud migration from scratch on AWS',
				'Infrastructure as Code with Terraform',
				'ECS container orchestration for streaming services',
				'Lambda + SQS for automated request processing',
				'Sub-100ms response times in production'
			],
			links: {},
			role: 'Software Engineer',
			year: '2024',
			gradient: 'from-cyan-500/10 to-emerald-500/10'
		},
		{
			number: '03',
			slug: 'unberry',
			title: 'Unberry ATS',
			description:
				'Comprehensive recruitment backend with automated APIs for applicant tracking and hiring workflows.',
			longDescription: [
				'Unberry is a full-featured Applicant Tracking System (ATS) backend built with Node.js, providing automated recruitment APIs that streamline the entire hiring pipeline.',
				'The system includes candidate tracking, automated screening processes, and recruitment analytics — replacing manual workflows with intelligent automation.',
				'Significantly improved hiring efficiency by reducing manual recruitment tasks and enabling faster candidate processing for HR teams.'
			],
			tech: ['Node.js', 'REST API', 'PostgreSQL', 'Docker'],
			features: [
				'Automated recruitment API pipeline',
				'Candidate tracking and workflow management',
				'Automated screening and filtering processes',
				'Recruitment analytics and reporting',
				'Faster candidate processing for HR teams'
			],
			links: {},
			role: 'Software Engineer',
			year: '2023',
			gradient: 'from-pink-500/10 to-violet-500/10'
		},
		{
			number: '04',
			slug: 'kotak-connect',
			title: 'Kotak Connect',
			description:
				'Meeting scheduling app for Kotak Securities — 50,000+ downloads, led team of 5 developers.',
			longDescription: [
				'Kotak Connect is a scalable meeting scheduling application built for Kotak Securities, leveraging Flutter for cross-platform compatibility across tablet and mobile devices.',
				'As tech lead, I spearheaded a team of 5 developers using Agile methodologies, with Figma for UI/UX design and Git for version control, ensuring consistent delivery cadence.',
				"Successfully achieved 50,000+ downloads across Play Store and App Store, becoming a critical internal tool for Kotak Securities' operations."
			],
			tech: ['Flutter', 'Spring Boot', 'Figma', 'Agile'],
			features: [
				'Cross-platform Flutter app for tablet and mobile',
				'Led team of 5 developers with Agile methodologies',
				'50,000+ downloads on Play Store and App Store',
				'Figma-driven UI/UX design workflow',
				'Scalable backend architecture'
			],
			links: {},
			role: 'Tech Lead',
			year: '2023',
			gradient: 'from-amber-500/10 to-rose-500/10'
		},
		{
			number: '05',
			slug: 'ncp-volunteer',
			title: 'NCP Volunteer Platform',
			description:
				'Cross-platform mobile app with volunteer rewards system — 40,000+ downloads, 4.6-star rating.',
			longDescription: [
				'The NCP Volunteer Platform is a cross-platform mobile application with a Spring Boot backend, supporting both Android and iOS through Flutter. It features a volunteer rewards system that drove political engagement.',
				"I independently designed, developed, and deployed the entire system end-to-end — from backend APIs to the Flutter frontend — delivering a polished product that significantly boosted the party's digital outreach.",
				'Achieved 40,000+ downloads with a 4.6-star rating on both Play Store and App Store.'
			],
			tech: ['Spring Boot', 'Flutter', 'Android', 'iOS', 'REST API'],
			features: [
				'End-to-end solo development and deployment',
				'Spring Boot backend with Flutter cross-platform frontend',
				'Volunteer rewards and engagement platform',
				'40,000+ downloads with 4.6-star rating',
				'Scalable architecture supporting high traffic'
			],
			links: {},
			role: 'Solo Developer',
			year: '2022',
			gradient: 'from-emerald-500/10 to-blue-500/10'
		},
		{
			number: '06',
			slug: 'ncp-booth',
			title: 'NCP Booth',
			description:
				'Real-time chat integration mobile app — 1 lakh new voters, 200+ daily chats, delivered ahead of schedule.',
			longDescription: [
				'NCP Booth is a Flutter-based mobile application with real-time chat functionality via Freshchat integration, built to enhance political engagement and voter registration.',
				'I led a team of 3 developers, employing Agile methodologies with regular code reviews and comprehensive unit testing to maintain quality while delivering ahead of schedule.',
				'The app resulted in 1 lakh new voter registrations, 200+ daily active chats, and 2,000+ downloads, significantly enhancing political engagement at the grassroots level.'
			],
			tech: ['Flutter', 'Freshchat', 'Agile', 'Spring Boot'],
			features: [
				'Real-time chat via Freshchat integration',
				'Led team of 3 developers using Agile',
				'1 lakh new voter registrations',
				'200+ daily active chats',
				'Delivered ahead of schedule'
			],
			links: {},
			role: 'Tech Lead',
			year: '2022',
			gradient: 'from-rose-500/10 to-amber-500/10'
		},
		{
			number: '07',
			slug: 'splitwise-sdk',
			title: 'Splitwise SDK',
			description:
				'Published Dart SDK for Splitwise API integration — slashed Flutter dev time by 50%.',
			longDescription: [
				'The Splitwise SDK is a Dart library for effortless Splitwise API integration into Flutter applications, published on pub.dev for the broader developer community.',
				'It streamlines the integration process, enabling developers to seamlessly incorporate expense-sharing functionality into their apps without wrestling with raw API calls.',
				'Successfully published and adopted, the SDK slashed development time by 50% for Flutter developers integrating Splitwise features.'
			],
			tech: ['Dart', 'Flutter', 'REST API', 'pub.dev'],
			features: [
				'Published on pub.dev for community use',
				'Complete wrapper for Splitwise REST API',
				'Type-safe models for all API entities',
				'50% reduction in integration development time',
				'Comprehensive documentation and examples'
			],
			links: {},
			role: 'Solo Developer',
			year: '2021',
			gradient: 'from-blue-500/10 to-violet-500/10'
		}
	] as Project[]
};

export function getProjectBySlug(slug: string): Project | undefined {
	return projectsContent.projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
	return projectsContent.projects.map((p) => p.slug);
}

export const contactContent = {
	heading: 'Have a project?',
	subheading: "Let's create something amazing together.",
	cta: "Let's talk",
	email: 'srthk.pthk4@gmail.com'
};

export const navLinks = [
	{ label: 'About', href: '#about' },
	{ label: 'Skills', href: '#skills' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'Contact', href: '#contact' }
];
