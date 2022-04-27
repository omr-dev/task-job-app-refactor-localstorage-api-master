import { useState, useEffect } from 'react';
import './App.scss';
import _jobs from './data/jobs.json';
import { JobsFull } from './components/JobsFull';
import { JobsList } from './components/JobsList';

_jobs.forEach((job) => {
	job.status = 'accepted';
});

const techItemsUrl = 'https://edwardtanguay.netlify.app/share/techItems.json';

const statuses = ['send', 'wait', 'interview', 'declined', 'accepted'];

function App() {
	const [displayKind, setDisplayKind] = useState('');
	const [jobs, setJobs] = useState([]);
	const [techItems, setTechItems] = useState([]);

	const saveToLocalStorage = () => {
		if (displayKind !== '') {
			const jobAppState = {
				displayKind,
				jobs,
			};
			localStorage.setItem('jobAppState', JSON.stringify(jobAppState));
		}
	};

	const loadLocalStorage = () => {
		const jobAppState = JSON.parse(localStorage.getItem('jobAppState'));
		if (jobAppState === null) {
			setDisplayKind('list');
			setJobs(_jobs);
		} else {
			setDisplayKind(jobAppState.displayKind);
			setJobs(jobAppState.jobs);
		}
	};

	const loadTechItems = () => {
		(async () => {
			const response = await fetch(techItemsUrl);
			const data = await response.json();
			setTechItems(data);
		})();
	}

	useEffect(() => {
		loadLocalStorage();
		loadTechItems();
	}, []);

	useEffect(() => {
		saveToLocalStorage();
	}, [displayKind, jobs]);

	const handleToggleView = () => {
		const _displayKind = displayKind === 'full' ? 'list' : 'full';
		setDisplayKind(_displayKind);
	};

	const handleStatusChange = (job) => {
		let statusIndex = statuses.indexOf(job.status);
		statusIndex++;
		if (statusIndex > statuses.length - 1) {
			statusIndex = 0;
		}
		job.status = statuses[statusIndex];
		setJobs([...jobs]);
	};

	return (
		<div className="App">
			<h1>Job Application Process</h1>
			<div>There are {techItems.length} tech items.</div>
			<button onClick={handleToggleView}>Toggle View</button>
			{displayKind === 'full' ? (
				<JobsFull jobs={jobs} handleStatusChange={handleStatusChange} techItems={techItems} />
			) : (
				<JobsList jobs={jobs} />
			)}
		</div>
	);
}

export default App;
